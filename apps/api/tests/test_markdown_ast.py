"""Unit tests for the markdown AST extraction and reconstruction pipeline.

Tests cover:
- extract_segments: identifies translatable text, skips non-translatable blocks
- apply_translations: slots translated text back into the token tree
- render_pages_html: produces correct HTML from token trees
"""

import pytest

from app.markdown_ast import apply_translations, extract_segments, render_pages_html
from app.schemas import TextSegment


class TestExtractSegments:
    def test_paragraph_extracted(self):
        segments, _ = extract_segments(["Hello world"])
        assert len(segments) == 1
        assert segments[0].text == "Hello world"
        assert segments[0].id == "pg0_b0"

    def test_heading_extracted(self):
        segments, _ = extract_segments(["# My Heading"])
        assert len(segments) == 1
        assert segments[0].text == "My Heading"

    def test_multiple_paragraphs_extracted(self):
        segments, _ = extract_segments(["First.\n\nSecond.\n\nThird."])
        assert len(segments) == 3
        assert segments[0].text == "First."
        assert segments[1].text == "Second."
        assert segments[2].text == "Third."

    def test_list_items_extracted(self):
        segments, _ = extract_segments(["- Item one\n- Item two\n- Item three"])
        texts = [s.text for s in segments]
        assert "Item one" in texts
        assert "Item two" in texts
        assert "Item three" in texts

    def test_ordered_list_items_extracted(self):
        segments, _ = extract_segments(["1. First\n2. Second"])
        texts = [s.text for s in segments]
        assert "First" in texts
        assert "Second" in texts

    def test_image_only_paragraph_skipped(self):
        segments, _ = extract_segments(["![alt text](image.png)"])
        assert len(segments) == 1
        assert segments[0].text == ""

    def test_display_math_dollar_skipped(self):
        segments, _ = extract_segments(["$$E = mc^2$$"])
        assert len(segments) == 1
        assert segments[0].text == ""

    def test_display_math_bracket_skipped(self):
        segments, _ = extract_segments([r"\[E = mc^2\]"])
        # If it's an inline paragraph starting with \[, should be skipped
        assert all(s.text == "" for s in segments)

    def test_inline_code_preserved_as_tag(self):
        segments, _ = extract_segments(["Use `print()` to output text"])
        assert len(segments) == 1
        assert "<code>print()</code>" in segments[0].text
        assert "Use" in segments[0].text

    def test_softbreak_becomes_space(self):
        # A single newline in markdown (no blank line) = soft break
        segments, _ = extract_segments(["Line one\nLine two"])
        assert len(segments) == 1
        assert " " in segments[0].text

    def test_multiple_pages_produce_separate_segments(self):
        segments, _ = extract_segments(["Page one.", "Page two."])
        assert len(segments) == 2
        assert segments[0].id.startswith("pg0_")
        assert segments[1].id.startswith("pg1_")

    def test_segment_ids_unique_within_page(self):
        segments, _ = extract_segments(["Para 1.\n\nPara 2.\n\nPara 3."])
        ids = [s.id for s in segments]
        assert len(ids) == len(set(ids))

    def test_segment_ids_unique_across_pages(self):
        segments, _ = extract_segments(["A.", "B.", "C."])
        ids = [s.id for s in segments]
        assert len(ids) == len(set(ids))

    def test_code_fence_not_extracted(self):
        segments, _ = extract_segments(["```python\nprint('hello')\n```"])
        assert all(s.text == "" or "print" not in s.text for s in segments)

    def test_table_header_cells_extracted(self):
        md = "| Header 1 | Header 2 |\n|---|---|\n| Cell A | Cell B |"
        segments, _ = extract_segments([md])
        texts = [s.text for s in segments if s.text]
        assert any("Header 1" in t for t in texts)
        assert any("Header 2" in t for t in texts)

    def test_table_body_cells_extracted(self):
        md = "| Col A | Col B |\n|---|---|\n| Value 1 | Value 2 |"
        segments, _ = extract_segments([md])
        texts = [s.text for s in segments if s.text]
        assert any("Value 1" in t for t in texts)
        assert any("Value 2" in t for t in texts)

    def test_mixed_content_page(self):
        md = "# Title\n\nA paragraph.\n\n- List item\n\n| H |\n|---|\n| C |"
        segments, _ = extract_segments([md])
        texts = [s.text for s in segments if s.text]
        assert any("Title" in t for t in texts)
        assert any("A paragraph." in t for t in texts)
        assert any("List item" in t for t in texts)
        assert any("H" in t for t in texts)
        assert any("C" in t for t in texts)

    def test_segment_path_format(self):
        segments, _ = extract_segments(["Para."])
        assert segments[0].path.startswith("p0:t")

    def test_returns_page_tokens_same_count_as_pages(self):
        _, page_tokens = extract_segments(["Page 1.", "Page 2.", "Page 3."])
        assert len(page_tokens) == 3

    def test_empty_page_produces_no_segments(self):
        segments, _ = extract_segments([""])
        assert all(s.text == "" for s in segments)


class TestApplyTranslations:
    def test_translates_single_paragraph(self):
        pages = ["Hello world"]
        segments, _ = extract_segments(pages)
        seg_map = {segments[0].id: "안녕 세상"}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "안녕 세상" in html

    def test_translates_heading(self):
        pages = ["# English Title"]
        segments, _ = extract_segments(pages)
        seg_map = {segments[0].id: "한국어 제목"}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "한국어 제목" in html

    def test_translates_multiple_paragraphs(self):
        pages = ["First.\n\nSecond."]
        segments, _ = extract_segments(pages)
        seg_map = {
            segments[0].id: "첫째.",
            segments[1].id: "둘째.",
        }
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "첫째." in html
        assert "둘째." in html

    def test_partial_translation_keeps_original(self):
        pages = ["Translated.\n\nUntranslated."]
        segments, _ = extract_segments(pages)
        seg_map = {segments[0].id: "번역됨."}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "번역됨." in html
        assert "Untranslated." in html

    def test_image_src_preserved_after_translation(self):
        pages = ["![alt](image.png)\n\nSome text"]
        segments, _ = extract_segments(pages)
        text_segs = [s for s in segments if s.text]
        seg_map = {text_segs[0].id: "번역된 텍스트"}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "번역된 텍스트" in html
        assert 'src="image.png"' in html

    def test_skipped_math_segment_unchanged(self):
        pages = ["$$E=mc^2$$\n\nNormal text."]
        segments, _ = extract_segments(pages)
        text_segs = [s for s in segments if s.text]
        seg_map = {text_segs[0].id: "번역된 텍스트."}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "번역된 텍스트." in html

    def test_table_cells_translated(self):
        pages = ["| Header |\n|---|\n| Cell |"]
        segments, _ = extract_segments(pages)
        translatable = [s for s in segments if s.text]
        assert len(translatable) >= 2  # header and cell
        seg_map = {s.id: f"번역_{i}" for i, s in enumerate(translatable)}
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "번역_0" in html
        assert "번역_1" in html

    def test_empty_seg_map_leaves_original(self):
        pages = ["Original content."]
        page_tokens = apply_translations({}, pages)
        html = render_pages_html(page_tokens)
        assert "Original content." in html

    def test_multipage_translations(self):
        pages = ["Page one text.", "Page two text."]
        segments, _ = extract_segments(pages)
        seg_map = {
            segments[0].id: "첫 번째 페이지.",
            segments[1].id: "두 번째 페이지.",
        }
        page_tokens = apply_translations(seg_map, pages)
        html = render_pages_html(page_tokens)
        assert "첫 번째 페이지." in html
        assert "두 번째 페이지." in html


class TestRenderPagesHtml:
    def test_single_page_renders(self):
        pages = ["Hello world"]
        _, tokens = extract_segments(pages)
        html = render_pages_html(tokens)
        assert "<p>" in html
        assert "Hello world" in html

    def test_multiple_pages_separated_by_hr(self):
        pages = ["Page one.", "Page two."]
        _, tokens = extract_segments(pages)
        html = render_pages_html(tokens)
        assert "<hr>" in html
        assert "Page one." in html
        assert "Page two." in html

    def test_headings_render_correctly(self):
        pages = ["# H1\n\n## H2\n\n### H3"]
        _, tokens = extract_segments(pages)
        html = render_pages_html(tokens)
        assert "<h1>" in html
        assert "<h2>" in html
        assert "<h3>" in html

    def test_table_renders_with_tags(self):
        pages = ["| A | B |\n|---|---|\n| 1 | 2 |"]
        _, tokens = extract_segments(pages)
        html = render_pages_html(tokens)
        assert "<table>" in html
        assert "<th>" in html
        assert "<td>" in html

    def test_list_renders_with_ul(self):
        pages = ["- alpha\n- beta"]
        _, tokens = extract_segments(pages)
        html = render_pages_html(tokens)
        assert "<ul>" in html
        assert "<li>" in html

    def test_returns_string(self):
        _, tokens = extract_segments(["test"])
        html = render_pages_html(tokens)
        assert isinstance(html, str)

    def test_empty_pages_returns_empty_string(self):
        _, tokens = extract_segments([""])
        html = render_pages_html(tokens)
        # Should not raise; may be empty or minimal whitespace
        assert isinstance(html, str)
