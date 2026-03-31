"""Markdown AST utilities for text extraction and reconstruction.

Parses markdown into a token tree, extracts only translatable text
(as lightweight HTML snippets), and reconstructs HTML from modified tokens.
The LLM never sees markdown formatting syntax.
"""

from __future__ import annotations

from markdown_it import MarkdownIt
from markdown_it.token import Token

from .schemas import TextSegment

# Block token types whose inline content should be translated
_TRANSLATABLE_PARENTS = {
    "paragraph_open",
    "heading_open",
    "bullet_list_open",
    "th_open",
    "td_open",
}

_DISPLAY_MATH_PREFIXES = ("$$", "\\[")


def _make_md() -> MarkdownIt:
    return MarkdownIt("commonmark", {"html": True}).enable("table")


def _inline_to_text(children: list[Token]) -> str:
    """Extract plain text from inline token children.

    Strips bold/italic/strikethrough tags — the LLM only sees raw text.
    This prevents the LLM from misplacing HTML formatting tags during translation.
    """
    parts: list[str] = []
    for child in children:
        if child.type == "text":
            parts.append(child.content)
        elif child.type == "softbreak":
            parts.append(" ")
        elif child.type == "hardbreak":
            parts.append("<br>")
        elif child.type == "code_inline":
            parts.append(f"<code>{child.content}</code>")
        # bold/italic/strikethrough tags are intentionally skipped
    return "".join(parts)


def _is_display_math(content: str) -> bool:
    stripped = content.strip()
    return any(stripped.startswith(p) for p in _DISPLAY_MATH_PREFIXES)


def _find_parent_type(tokens: list[Token], idx: int) -> str:
    """Walk backwards from an inline token to find its parent block type."""
    for i in range(idx - 1, -1, -1):
        if tokens[i].nesting == 1:  # opening tag
            return tokens[i].type
    return ""


def _should_translate(parent_type: str) -> bool:
    """Check if the parent block type indicates translatable content."""
    # Translate paragraphs, headings, and list items
    return parent_type in _TRANSLATABLE_PARENTS or parent_type == "list_item_open"


def extract_segments(
    pages_markdown: list[str],
) -> tuple[list[TextSegment], list[list[Token]]]:
    """Parse markdown pages and extract translatable text segments.

    Returns:
        segments: TextSegment list (text = simplified HTML, or empty for skipped)
        page_tokens: token list per page for reconstruction
    """
    md = _make_md()
    all_segments: list[TextSegment] = []
    page_tokens: list[list[Token]] = []

    for pi, page_md in enumerate(pages_markdown):
        tokens = md.parse(page_md)
        page_tokens.append(tokens)
        bi = 0

        for ti, token in enumerate(tokens):
            if token.type != "inline" or not token.children:
                continue

            parent_type = _find_parent_type(tokens, ti)

            # Only translate paragraphs, headings, and list items
            if not _should_translate(parent_type):
                continue

            seg_id = f"pg{pi}_b{bi}"
            bi += 1

            content = token.content

            # Skip display math blocks
            if _is_display_math(content):
                all_segments.append(
                    TextSegment(id=seg_id, text="", path=f"p{pi}:t{ti}")
                )
                continue

            # Skip image-only blocks
            if content.strip().startswith("!["):
                all_segments.append(
                    TextSegment(id=seg_id, text="", path=f"p{pi}:t{ti}")
                )
                continue

            # Extract translatable plain text
            html_snippet = _inline_to_text(token.children)
            all_segments.append(
                TextSegment(id=seg_id, text=html_snippet, path=f"p{pi}:t{ti}")
            )

    return all_segments, page_tokens


def apply_translations(
    seg_map: dict[str, str],
    pages_markdown: list[str],
) -> list[list[Token]]:
    """Re-parse pages and replace translatable inline content with translations."""
    md = _make_md()
    page_tokens: list[list[Token]] = []

    for pi, page_md in enumerate(pages_markdown):
        tokens = md.parse(page_md)
        page_tokens.append(tokens)
        bi = 0

        for ti, token in enumerate(tokens):
            if token.type != "inline" or not token.children:
                continue

            parent_type = _find_parent_type(tokens, ti)
            if not _should_translate(parent_type):
                continue

            seg_id = f"pg{pi}_b{bi}"
            bi += 1

            translated = seg_map.get(seg_id)
            if translated:
                token.children = [
                    Token("html_inline", "", 0, content=translated)
                ]
                token.content = translated

    return page_tokens


def render_pages_html(page_tokens: list[list[Token]]) -> str:
    """Render all page token trees to combined HTML."""
    md = _make_md()
    parts: list[str] = []
    for tokens in page_tokens:
        parts.append(md.renderer.render(tokens, md.options, {}))
    return "\n<hr>\n".join(parts)
