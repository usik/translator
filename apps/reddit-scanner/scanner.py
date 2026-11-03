"""Reddit scanner — unauthenticated JSON API, no credentials needed."""
import time
import json
import urllib.request
import urllib.parse
from dataclasses import dataclass, field
from datetime import datetime, timezone

HEADERS = {"User-Agent": "xenith-scanner/1.0 (personal growth tool; contact via tryxenith.com)"}

TARGETS = [
    # Korean community subreddits
    {"subreddit": "korea",           "queries": ["hwp", "translate document", "korean document english"]},
    {"subreddit": "Living_in_Korea", "queries": ["hwp", "translate", "document english", "visa document"]},
    {"subreddit": "koreaimmigration", "queries": ["translate", "document", "hwp", "english translation"]},
    {"subreddit": "seoulexpats",     "queries": ["translate", "hwp", "document"]},
    # Japanese community subreddits
    # NOTE: r/japanlife has strict mods — account banned 2026-04-03. Removed from scanner.
    # {"subreddit": "japanlife",       "queries": ["translate document", "official translation", "certified translation"]},
    {"subreddit": "JapanFinance",    "queries": ["translate", "document translation", "official translation"]},
    {"subreddit": "movingtojapan",   "queries": ["translate", "document", "official translation"]},
    {"subreddit": "LearnJapanese",   "queries": ["translate document", "translation service"]},
    # General expat / document subreddits
    {"subreddit": "expats",          "queries": ["korean document", "japanese document", "hwp", "translate official"]},
    {"subreddit": "immigration",     "queries": ["korean translation", "japanese translation", "document translate"]},
    {"subreddit": "digitalnomad",    "queries": ["korean document", "japanese document", "translate hwp"]},
]

RELEVANCE_KEYWORDS = [
    # Strong signals
    ("hwp", 10), ("hwpx", 10), ("한글", 8), ("hancom", 8),
    ("translate hwp", 15), ("convert hwp", 15),
    # Medium signals
    ("translate document", 5), ("document translation", 5), ("official translation", 5),
    ("certified translation", 5), ("notarized translation", 4),
    ("korean to english", 6), ("japanese to english", 6),
    ("english to korean", 4), ("english to japanese", 4),
    # Context signals
    ("visa", 3), ("immigration", 3), ("contract", 3), ("invoice", 3),
    ("pdf", 2), ("docx", 2), ("word document", 2),
    # Negative signals (subtract)
    ("tattoo", -20), ("food", -10), ("restaurant", -10), ("dating", -15),
    ("language learning", -5), ("grammar", -5),
]

MIN_RELEVANCE_SCORE = 5
MAX_THREADS_PER_QUERY = 10


@dataclass
class Thread:
    id: str
    subreddit: str
    title: str
    url: str
    permalink: str
    body: str
    score: int
    num_comments: int
    created_utc: float
    top_comments: list[dict] = field(default_factory=list)
    relevance_score: int = 0

    @property
    def full_url(self) -> str:
        return f"https://reddit.com{self.permalink}"

    @property
    def age_hours(self) -> float:
        now = datetime.now(timezone.utc).timestamp()
        return (now - self.created_utc) / 3600


def _fetch(url: str, retries: int = 3) -> dict | None:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=10) as resp:
                return json.loads(resp.read())
        except Exception as e:
            if attempt == retries - 1:
                print(f"  [WARN] fetch failed for {url}: {e}")
                return None
            time.sleep(2 ** attempt)
    return None


def score_relevance(thread: Thread) -> int:
    text = f"{thread.title} {thread.body}".lower()
    score = 0
    for kw, pts in RELEVANCE_KEYWORDS:
        if kw.lower() in text:
            score += pts
    # Bonus for recent threads (< 7 days)
    if thread.age_hours < 168:
        score += 2
    # Bonus for unanswered / low-comment threads (opportunity to help)
    if thread.num_comments < 5:
        score += 3
    return score


def fetch_subreddit_search(subreddit: str, query: str, limit: int = MAX_THREADS_PER_QUERY) -> list[Thread]:
    encoded_q = urllib.parse.quote(query)
    url = f"https://www.reddit.com/r/{subreddit}/search.json?q={encoded_q}&restrict_sr=1&sort=new&limit={limit}"
    data = _fetch(url)
    if not data:
        return []

    threads = []
    try:
        for post in data["data"]["children"]:
            p = post["data"]
            t = Thread(
                id=p["id"],
                subreddit=p["subreddit"],
                title=p["title"],
                url=p.get("url", ""),
                permalink=p["permalink"],
                body=p.get("selftext", ""),
                score=p.get("score", 0),
                num_comments=p.get("num_comments", 0),
                created_utc=p.get("created_utc", 0),
            )
            t.relevance_score = score_relevance(t)
            if t.relevance_score >= MIN_RELEVANCE_SCORE:
                threads.append(t)
    except (KeyError, TypeError) as e:
        print(f"  [WARN] parse error for r/{subreddit} '{query}': {e}")

    time.sleep(1)  # polite delay between requests
    return threads


def fetch_thread_comments(thread: Thread, max_comments: int = 5) -> list[dict]:
    """Fetch top-level comments for context when generating reply drafts."""
    url = f"https://www.reddit.com{thread.permalink}.json?limit=10&depth=1"
    data = _fetch(url)
    if not data or not isinstance(data, list) or len(data) < 2:
        return []

    comments = []
    try:
        for child in data[1]["data"]["children"]:
            c = child.get("data", {})
            if c.get("body") and c["body"] != "[deleted]" and c["body"] != "[removed]":
                comments.append({
                    "author": c.get("author", "unknown"),
                    "body": c["body"][:500],  # truncate long comments
                    "score": c.get("score", 0),
                })
                if len(comments) >= max_comments:
                    break
    except (KeyError, TypeError, IndexError):
        pass

    time.sleep(1)
    return comments


def scan_all() -> list[Thread]:
    """Scan all configured subreddits and return deduplicated, sorted threads."""
    seen_ids: set[str] = set()
    all_threads: list[Thread] = []

    for target in TARGETS:
        sub = target["subreddit"]
        for query in target["queries"]:
            print(f"  Scanning r/{sub} for '{query}'...")
            threads = fetch_subreddit_search(sub, query)
            for t in threads:
                if t.id not in seen_ids:
                    seen_ids.add(t.id)
                    all_threads.append(t)

    # Sort by relevance score desc, then recency
    all_threads.sort(key=lambda t: (t.relevance_score, -t.age_hours), reverse=True)
    return all_threads
