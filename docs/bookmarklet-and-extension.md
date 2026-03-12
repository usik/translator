# Bookmarklet & Browser Extension — Roadmap

---

## Phase 1: Bookmarklet (Build first)

A simple bookmarklet that sends selected text (or full page text) to tryxenith.com/translate. Zero review process, works immediately in any browser.

### How it works
1. User drags the bookmarklet link to their bookmark bar (from our landing page or /translate page)
2. On any webpage, user selects Korean text (or selects nothing for full page)
3. Clicks the bookmarklet
4. Opens tryxenith.com/translate in a new tab with the text pre-filled

### Implementation
- ~10 lines of JavaScript in a `javascript:` URL
- Grabs `window.getSelection().toString()` (or `document.body.innerText` if nothing selected)
- Opens `tryxenith.com/translate?text=<encoded text>&source=auto&target=en`
- Frontend /translate page reads the `text` query param and pre-fills the source textarea

### Frontend changes needed
- /translate page: read `?text=` query param on load, populate source textarea
- Landing page: add a "Translate Any Page" feature card with drag-to-install bookmarklet link
- /translate page: add a small "Install bookmarklet" section or tooltip

### Landing page feature card
> **Translate Any Page**
> Drag our bookmarklet to your bookmark bar and translate Korean text on any website in one click.

### When to build
After confirming at least some traffic from K-content fans or importers. The bookmarklet is only useful if people are already using the site.

---

## Phase 2: Browser Extension (Build later, only if bookmarklet gets traction)

A Chrome/Firefox extension with richer features. Only worth building after the bookmarklet proves demand.

### Features
- Right-click selected text → "Translate with Xenith"
- Floating popup with translation result (no tab switch needed)
- "Translate this page" button in toolbar
- Auto-detect Korean text on page
- Screenshot selection tool → OCR + translate (key feature for K-content fans)

### Technical requirements
- Chrome Manifest V3
- Firefox WebExtensions API
- Chrome Web Store review process (~1-2 weeks)
- Ongoing maintenance for API changes and manifest updates

### When to build
- Bookmarklet has at least 50+ weekly users
- Users are requesting richer functionality (no tab switch, screenshot support)
- You have bandwidth for the Chrome Web Store submission process

---

## Priority
1. Get users first (blog posts, community posts, SEO)
2. Build bookmarklet when there's traffic
3. Build extension when bookmarklet proves demand
