"""HTML email digest sender via SMTP."""
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timezone

from scanner import Thread

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
DIGEST_TO = os.environ.get("DIGEST_TO", "")


def _relevance_badge(score: int) -> str:
    if score >= 15:
        return '<span style="background:#22c55e;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">HOT</span>'
    if score >= 10:
        return '<span style="background:#f59e0b;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">GOOD</span>'
    return '<span style="background:#94a3b8;color:white;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">OK</span>'


def _thread_card(thread: Thread, draft: str, index: int) -> str:
    age_str = (
        f"{thread.age_hours:.0f}h ago"
        if thread.age_hours < 48
        else f"{thread.age_hours/24:.0f}d ago"
    )
    skip_note = ""
    draft_html = ""

    if draft.strip() == "SKIP":
        skip_note = '<p style="color:#94a3b8;font-style:italic;font-size:13px;">AI suggested skipping — not a strong match.</p>'
    else:
        draft_escaped = draft.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")
        draft_html = f"""
        <div style="margin-top:12px;">
          <p style="font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 6px;">Suggested Comment Draft</p>
          <div style="background:#f8fafc;border-left:3px solid #6366f1;padding:12px 14px;border-radius:0 8px 8px 0;font-size:13px;color:#374151;line-height:1.6;">
            {draft_escaped}
          </div>
          <p style="font-size:11px;color:#94a3b8;margin:6px 0 0;">Edit before posting. Always personalize further.</p>
        </div>
        """

    return f"""
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:12px;color:#6b7280;font-weight:500;">#{index} · r/{thread.subreddit}</span>
        {_relevance_badge(thread.relevance_score)}
        <span style="font-size:11px;color:#9ca3af;margin-left:auto;">{age_str} · {thread.num_comments} comments · ↑{thread.score}</span>
      </div>
      <a href="{thread.full_url}" style="color:#1e293b;font-size:15px;font-weight:600;text-decoration:none;line-height:1.4;display:block;margin-bottom:8px;">{thread.title}</a>
      {f'<p style="font-size:13px;color:#4b5563;margin:0 0 8px;line-height:1.5;">{thread.body[:300].replace(chr(10), " ")}{"..." if len(thread.body) > 300 else ""}</p>' if thread.body else ""}
      {skip_note}
      {draft_html}
      <div style="margin-top:14px;">
        <a href="{thread.full_url}" style="display:inline-block;background:#6366f1;color:white;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Open Thread →</a>
      </div>
    </div>
    """


def build_html(threads_with_drafts: list[tuple[Thread, str]], scan_date: str) -> str:
    hot = [(t, d) for t, d in threads_with_drafts if t.relevance_score >= 15]
    good = [(t, d) for t, d in threads_with_drafts if 10 <= t.relevance_score < 15]
    ok = [(t, d) for t, d in threads_with_drafts if t.relevance_score < 10]

    def section(title: str, items: list, start_index: int) -> str:
        if not items:
            return ""
        cards = "".join(_thread_card(t, d, start_index + i) for i, (t, d) in enumerate(items))
        return f"""
        <h2 style="font-size:16px;font-weight:700;color:#1e293b;margin:24px 0 12px;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">{title}</h2>
        {cards}
        """

    hot_section = section(f"🔥 Hot Threads ({len(hot)})", hot, 1)
    good_section = section(f"✅ Good Threads ({len(good)})", good, len(hot) + 1)
    ok_section = section(f"📋 Other Threads ({len(ok)})", ok, len(hot) + len(good) + 1)

    total = len(threads_with_drafts)
    skipped = sum(1 for _, d in threads_with_drafts if d.strip() == "SKIP")

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:680px;margin:0 auto;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:16px;padding:24px;margin-bottom:20px;color:white;">
          <h1 style="margin:0 0 4px;font-size:20px;font-weight:700;">Xenith Reddit Digest</h1>
          <p style="margin:0;opacity:0.85;font-size:14px;">{scan_date} · {total} threads found · {skipped} AI-suggested skips</p>
        </div>

        <!-- Stats bar -->
        <div style="background:white;border-radius:12px;padding:16px;margin-bottom:20px;display:flex;gap:20px;">
          <div style="text-align:center;flex:1;">
            <div style="font-size:22px;font-weight:700;color:#6366f1;">{len(hot)}</div>
            <div style="font-size:12px;color:#6b7280;">Hot</div>
          </div>
          <div style="text-align:center;flex:1;">
            <div style="font-size:22px;font-weight:700;color:#f59e0b;">{len(good)}</div>
            <div style="font-size:12px;color:#6b7280;">Good</div>
          </div>
          <div style="text-align:center;flex:1;">
            <div style="font-size:22px;font-weight:700;color:#94a3b8;">{len(ok)}</div>
            <div style="font-size:12px;color:#6b7280;">Other</div>
          </div>
          <div style="text-align:center;flex:1;">
            <div style="font-size:22px;font-weight:700;color:#64748b;">{skipped}</div>
            <div style="font-size:12px;color:#6b7280;">Skipped</div>
          </div>
        </div>

        {hot_section}
        {good_section}
        {ok_section}

        <!-- Footer -->
        <div style="text-align:center;padding:20px;color:#94a3b8;font-size:12px;">
          Xenith Reddit Scanner · Personal use only<br>
          Always edit drafts before posting · Be genuine
        </div>
      </div>
    </body>
    </html>
    """


def send_digest(threads_with_drafts: list[tuple[Thread, str]]) -> bool:
    if not SMTP_USER or not SMTP_PASS or not DIGEST_TO:
        print("[ERROR] SMTP_USER, SMTP_PASS, or DIGEST_TO not configured")
        return False

    scan_date = datetime.now(timezone.utc).strftime("%B %d, %Y")
    html = build_html(threads_with_drafts, scan_date)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Xenith Reddit Digest — {scan_date} ({len(threads_with_drafts)} threads)"
    msg["From"] = SMTP_USER
    msg["To"] = DIGEST_TO
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, DIGEST_TO, msg.as_string())
        print(f"[OK] Digest sent to {DIGEST_TO}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        return False
