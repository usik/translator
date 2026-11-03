"""Gemini-powered comment draft generator."""
import os
import json
import urllib.request

from scanner import Thread

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"
# Uses OpenAI-compatible endpoint (same as the main API)
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"

XENITH_CONTEXT = """
Xenith (tryxenith.com) is a free online document translator. Key strengths:
- ONLY tool that supports HWP and HWPX files (Korean Hangul word processor format)
- Format-preserving translation: keeps original layout, tables, headers intact
- Supports PDF, DOCX, HWPX, HWP, images (OCR)
- Completely free, no signup required
- AI-powered with high accuracy for Korean↔English and Japanese↔English

Brand voice: helpful, knowledgeable, genuine. Never pushy. Always lead with actual help,
mention Xenith naturally only when it's genuinely relevant. Be conversational, not corporate.
"""

COMMENT_SYSTEM_PROMPT = f"""You are a helpful Reddit commenter who genuinely wants to help people with document translation problems.
You know about Xenith (tryxenith.com) and can mention it when appropriate, but ONLY when it's truly relevant.

{XENITH_CONTEXT}

Rules:
1. Read the full thread context before writing
2. Lead with actual useful advice, not a product pitch
3. Mention Xenith only if it genuinely solves their specific problem
4. Match the tone of the subreddit (r/korea is casual, r/JapanFinance is more formal)
5. Keep comments concise — 2-4 short paragraphs max
6. If the thread is old (>30 days), note "I know this is an old thread but..."
7. NEVER sound like an advertisement. If you can't be genuinely helpful, say "skip this thread"
8. If the person's specific problem cannot be solved by Xenith, provide real alternatives and don't force a mention

Output format: just the comment text, ready to copy-paste. No extra formatting.
If you'd skip this thread, output exactly: SKIP
"""


def _call_gemini(prompt: str) -> str:
    if not GEMINI_API_KEY:
        return "[ERROR: GEMINI_API_KEY not set]"

    payload = {
        "model": GEMINI_MODEL,
        "messages": [
            {"role": "system", "content": COMMENT_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 512,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        GEMINI_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GEMINI_API_KEY}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"[ERROR generating draft: {e}]"


def generate_comment_draft(thread: Thread) -> str:
    """Generate a personalized comment draft for a thread."""
    comments_text = ""
    if thread.top_comments:
        comments_text = "\n\nEXISTING COMMENTS:\n" + "\n---\n".join(
            f"u/{c['author']} (score {c['score']}): {c['body']}"
            for c in thread.top_comments
        )

    age_note = ""
    if thread.age_hours > 720:  # > 30 days
        age_note = f"\n\nNote: This thread is {thread.age_hours/24:.0f} days old."
    elif thread.age_hours > 168:  # > 7 days
        age_note = f"\n\nNote: This thread is {thread.age_hours/24:.0f} days old."

    prompt = f"""Thread from r/{thread.subreddit}:

TITLE: {thread.title}

POST BODY:
{thread.body[:1500] if thread.body else "(no body — link post or very short)"}
{comments_text}
{age_note}

Write a helpful comment for this Reddit thread. Remember the rules."""

    return _call_gemini(prompt)
