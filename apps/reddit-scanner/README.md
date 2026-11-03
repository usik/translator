# Xenith Reddit Scanner

Daily digest of Reddit threads where Xenith can genuinely help. Runs at 4pm every day, opens an HTML report in your browser, and sends a macOS notification.

## How It Works

1. Scans ~10 Korean/Japanese community subreddits via Reddit's JSON API (no credentials needed)
2. Scores threads by relevance (HWP keywords, recency, unanswered questions)
3. Fetches top comments for context
4. Generates a personalized comment draft via Gemini for each thread
5. Saves HTML report to `~/Downloads/xenith-digest-YYYY-MM-DD.html` and opens it in browser

## Cron Schedule

Runs daily at **4:00pm local time**. Installed in your crontab:

```
0 16 * * * cd /Users/yusikkim/Desktop/Personal-Project/translator/apps/reddit-scanner && /opt/homebrew/bin/python3 main.py >> /tmp/xenith-scanner.log 2>&1
```

Check logs: `cat /tmp/xenith-scanner.log`

Manage cron: `crontab -e`

## Manual Run

```bash
cd apps/reddit-scanner

# Full run — saves HTML + opens browser + notifies
python main.py

# Dry run — prints to terminal only
python main.py --dry-run
```

## Config

All config is in `.env` (copy from `.env.example`):

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Already set — same key as the main API |

No email config needed.

## Subreddits

| Community | Subreddits |
|-----------|-----------|
| Korean | r/korea, r/Living_in_Korea, r/koreaimmigration, r/seoulexpats |
| Japanese | r/JapanFinance, r/movingtojapan, r/LearnJapanese |
| General | r/expats, r/immigration, r/digitalnomad |

> **Note:** r/japanlife is excluded — account was banned 2026-04-03 for promotion.

## Posting Guidelines

- **Always edit drafts** before posting — they're a starting point, not final copy
- **1-2 comments per day max** — quality over quantity
- Skip threads marked `SKIP` by the AI — not a strong fit
- Old threads (>30 days): the draft already adds "I know this is an old thread..."
- Be genuine — lead with real help, not a pitch

## Files

```
scanner.py    — Reddit scraper + relevance scorer
generator.py  — Gemini draft generator
emailer.py    — HTML builder (used for the browser report)
main.py       — Orchestrator
.env          — API key config (gitignored)
```
