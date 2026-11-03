"""Xenith Reddit Scanner — main orchestrator.

Run:
  python main.py           # scan + save HTML + open in browser + notify
  python main.py --dry-run # scan + print to stdout only
"""
import sys
import time
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# Load .env if present (no external deps needed)
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

from scanner import scan_all, fetch_thread_comments
from generator import generate_comment_draft
from emailer import build_html

MAX_THREADS_IN_DIGEST = 20
FETCH_COMMENTS_FOR_TOP_N = 10


def notify(title: str, message: str):
    subprocess.run([
        "osascript", "-e",
        f'display notification "{message}" with title "{title}" sound name "Glass"'
    ], check=False)


def run(dry_run: bool = False):
    print("=== Xenith Reddit Scanner ===\n")

    # 1. Scan
    print("Step 1: Scanning Reddit...")
    threads = scan_all()
    print(f"  Found {len(threads)} relevant threads\n")

    if not threads:
        print("No threads found. Exiting.")
        return

    # 2. Take top N
    top_threads = threads[:MAX_THREADS_IN_DIGEST]

    # 3. Fetch comments for top threads
    print(f"Step 2: Fetching comments for top {min(FETCH_COMMENTS_FOR_TOP_N, len(top_threads))} threads...")
    for i, thread in enumerate(top_threads[:FETCH_COMMENTS_FOR_TOP_N]):
        print(f"  [{i+1}/{min(FETCH_COMMENTS_FOR_TOP_N, len(top_threads))}] {thread.title[:60]}...")
        thread.top_comments = fetch_thread_comments(thread)
    print()

    # 4. Generate comment drafts
    print("Step 3: Generating comment drafts via Gemini...")
    threads_with_drafts = []
    for i, thread in enumerate(top_threads):
        print(f"  [{i+1}/{len(top_threads)}] {thread.title[:60]}...")
        draft = generate_comment_draft(thread)
        threads_with_drafts.append((thread, draft))
        time.sleep(0.5)
    print()

    # 5. Dry run: print to stdout only
    if dry_run:
        for i, (thread, draft) in enumerate(threads_with_drafts, 1):
            print(f"{'='*60}")
            print(f"#{i} [score={thread.relevance_score}] r/{thread.subreddit}")
            print(f"Title: {thread.title}")
            print(f"URL: {thread.full_url}")
            print(f"\n--- DRAFT ---\n{draft}\n")
        return

    # 6. Save HTML + open in browser + notify
    scan_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    out_path = Path.home() / "Downloads" / f"xenith-digest-{scan_date}.html"
    html = build_html(threads_with_drafts, scan_date)
    out_path.write_text(html, encoding="utf-8")
    print(f"Saved: {out_path}")

    subprocess.run(["open", str(out_path)], check=False)

    hot = sum(1 for t, _ in threads_with_drafts if t.relevance_score >= 15)
    notify("Xenith Reddit Digest", f"{len(threads_with_drafts)} threads · {hot} hot — digest open in browser")


if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    run(dry_run=dry_run)
