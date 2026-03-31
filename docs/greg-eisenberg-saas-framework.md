# Greg Eisenberg's 30-Step SaaS Framework — Applied to AP Automation

Source: [SaaS is minting millionaires again (here's how)](https://www.youtube.com/watch?v=9T1yWEq5kP0) — Greg Eisenberg, Startup Ideas Podcast

---

## Who is Greg Eisenberg

Adviser to TikTok and Reddit. Built and sold 3 venture-backed companies. Hosts the Startup Ideas podcast.

---

## Core Thesis

SaaS isn't dead — it's evolving. The new model: start with a subniche, build media, manually perform the workflow first, then automate with AI agents. Move from per-seat to per-task/outcome pricing. Your cost structure is lower than incumbents, you don't need venture funding, and AI lets a small team compete with large companies.

---

## The 30 Steps

### Phase 1: Find & Validate (Steps 1-5)

**1. Start with a subniche inside a big market**
- Big market: Accounts Payable / finance automation
- Subniche: AP automation for cross-border CJK (Korean, Japanese, Chinese) invoices
- Don't compete with the venture boys (Bill.com, Ramp, Expensify). Go bespoke.

**2. Map the subniche's workflow end-to-end**
- Receive invoice (PDF, scan, HWPX, email, Excel) in Korean/Japanese
- Manual data entry: vendor, amount, date, line items, tax, currency
- Translate fields to English
- Match invoice to PO and delivery receipt (3-way matching)
- Flag exceptions: wrong amount, missing PO, duplicate, currency mismatch
- Route for approval
- Schedule payment
- Reconcile with bank statement

**3. Identify where money changes hands**
- Invoice payments (the actual AP disbursement)
- Deposits to suppliers
- Material/inventory orders
- Currency exchange (KRW/JPY → USD)
- This is the wedge — you sit in the flow of money.

**4. Spot repetitive mechanical steps**
- Data entry from invoices (mechanical — agent handles this)
- Translation of Korean/Japanese fields (mechanical)
- Matching invoice to PO (mechanical with fuzzy logic)
- Duplicate detection (mechanical)
- Date format normalization (mechanical)
- Currency conversion lookup (mechanical)

**5. Quantify the cost of those steps**
- SMB finance person spends 15-30 hours/month on AP
- If their time is worth $50-100/hr → $750-3,000/month in labor
- Professional translation: $30-50 per document
- A tool that saves 50% of that time → easily worth $500-1,500/month

### Phase 2: Build Media (Steps 6-10)

**6. Create scroll-stopping content around the workflow**
- Use AI to generate content ideas, scripts, calendars
- Pick one channel to start (LinkedIn or TikTok)
- Content themes:
  - "Watch me process 20 Korean invoices in 5 minutes"
  - "The hidden cost of manually translating supplier invoices"
  - "Why your bilingual bookkeeper costs you $60K/year"
  - "Korean tax invoice (세금계산서) explained in 60 seconds"

**7. Study posts that get saves, replies, DMs**
- Track which content resonates
- Develop intuition for what the audience cares about

**8. Double down on organic angles that convert**
- Whatever gets engagement → do more of it

**9. Run paid ads on proven organic winners**
- Once organic works, put spend behind it
- Target: Korean-American business owners, CPA firms, importers

**10. Capture emails from day one**
- Email list = foundation
- Lead magnet ideas:
  - "Korean Invoice Translation Checklist (free PDF)"
  - "세금계산서 Field Guide for US Importers"
  - "Japanese Invoice System (インボイス制度) Cheat Sheet"

### Phase 3: Do It Manually First (Steps 11-14)

**11. Manually perform the workflow**
- Start as a service business: you + AI agents process invoices for clients
- This is NOT the sexy part, but it's critical
- You learn every edge case, every weird invoice format

**12. Document every step precisely**
- Every manual step becomes a future automation
- Document: what you look at, what decisions you make, what tools you use

**13. Separate judgment from mechanical tasks**
- Mechanical (automate first): OCR, field extraction, translation, matching, duplicate check
- Judgment (keep human): approving exceptions, flagging suspicious invoices, vendor relationship decisions
- AI is incredible at mechanical. Hit-or-miss on judgment.

**14. Turn mechanical tasks into agent workflows**
- This is the autoresearch loop:
  - Agent extracts fields from invoice
  - Agent translates Korean/Japanese → English
  - Agent matches to PO
  - Agent flags exceptions
  - Human reviews exceptions only
  - Every human correction improves the agent

### Phase 4: Build the Agent SaaS (Steps 15-18)

**15. Design agents to complete full tasks**
- Invoice Extraction Agent: takes raw file → structured JSON
- Translation Agent: Korean/Japanese fields → English
- Matching Agent: invoice ↔ PO ↔ delivery receipt
- Exception Agent: flags anomalies
- Report Agent: generates clean expense reports

**16. Connect agents to real tools (MCP)**
- Email (receive invoices automatically)
- Google Drive / Dropbox (shared folders)
- QuickBooks / Xero (push processed invoices)
- Slack (notify on exceptions)
- Stripe / bank API (payment scheduling)

**17. Add orchestration, retries, and verifications**
- "The orchestration layer is the new interface layer" — Scott Belsky
- Whoever owns the coordination layer owns the flow
- Retry on failed extractions, verify amounts against PO, double-check translations

**18. Store user preferences + long-term memory**
- Learn each vendor's invoice format over time
- Remember preferred translations for recurring items
- Store approval patterns (this manager always approves under $5K)
- THIS IS YOUR MOAT — the longer they use it, the better it gets

### Phase 5: Pricing Evolution (Steps 19-23)

**19. Launch narrow with high-touch onboarding**
- Don't build a self-serve signup flow yet
- Get on calls with first clients, understand their specific invoices
- Collect as much data as possible during onboarding

**20. Publish measurable proof**
- "Client X reduced AP processing from 25 hours/month to 10 hours/month"
- "98.5% field extraction accuracy on Korean invoices"
- "Average invoice processed in 12 seconds vs. 15 minutes manually"

**21. Move from per-seat to per-task pricing**
- Per invoice processed: $1-5 per invoice (depending on complexity)
- "Do this workflow for me. It's worth $200 every time you do it."
- This is where you undercut the incumbents (Bill.com charges per seat at $45-79/user/month)

**22. Outcome pricing**
- Charge based on results: hours saved, error reduction, compliance risk avoided
- "We guarantee 50% reduction in AP processing time or your money back"

**23. Increase pricing as value compounds**
- As you add more workflows (AP → AR → expense reports → tax filing)
- As your brand grows, you can charge premium

### Phase 6: Scale (Steps 24-30)

**24. Expand into adjacent workflows**
- Accounts Receivable (issuing invoices to clients)
- Expense report automation
- Tax filing preparation
- Vendor management
- Contract translation and management

**25. Orchestrate multiple agents across the lifecycle**
- Full financial operations: invoice in → payment out → books reconciled

**26. Build switching costs through data and memory**
- Every invoice processed = more vendor patterns learned
- Every correction = better prompts (autoresearch)
- Leaving means losing all that accumulated intelligence

**27. Turn power users into public case studies**
- Film clients talking about time saved
- "How [Company X] automated their Korean supplier invoices"

**28. Hire operators from inside the niche**
- Hire people who actually worked in AP at Korean/Japanese companies
- They understand the pain firsthand

**29. Reinvest profits into distribution + product depth**
- More content, more ads, deeper product features

**30. Become the default execution layer for that subniche**
- "If you deal with Korean or Japanese invoices, you use [our product]"
- That's the end state

---

## Key Quotes

> "Don't make the mistake of trying to build something for a huge market. That's where the venture boys are playing. This is for people who want to build a cash-flowing startup — $100K/month, $1M/month type thing."

> "A lot of these future SaaS businesses are actually going to start off as service businesses with human beings at the core of it."

> "AI is incredible at mechanical tasks. In judgment, sometimes it's good and sometimes it's bad. Start with mechanical tasks."

> "The orchestration layer is the new interface layer." — Scott Belsky

> "Move from per-seat to per-task pricing. Complete this workflow for me — it's worth $200 every time you do it."

> "Build switching costs through data and memory."

---

## Action Items (Mapped to Our Plan)

| Priority | Action | Status |
|----------|--------|--------|
| 1 | Map AP workflow end-to-end | Done (ap-automation-strategy.md) |
| 2 | Identify mechanical vs judgment tasks | Done (above) |
| 3 | Build autoresearch evaluation loop | Planned (ap-autoresearch-program.md) |
| 4 | Start manual service (3 pilot clients) | Not started |
| 5 | Create content channel (LinkedIn or TikTok) | Not started |
| 6 | Build email capture / lead magnet | Not started |
| 7 | Document every step during manual service | Not started |
| 8 | Turn documented steps into agent workflows | Not started |
| 9 | Launch self-serve product | Not started |
| 10 | Move to per-task/outcome pricing | Not started |
