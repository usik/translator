import re

from .schemas import ChatMessage, TextSegment


def extract_math(text: str) -> tuple[str, dict[str, str]]:
    """Replace LaTeX math expressions with placeholders before LLM translation.

    Returns (text_with_placeholders, {placeholder: original_latex}).
    """
    math_map: dict[str, str] = {}
    counter = 0

    def _replace(m: re.Match) -> str:
        nonlocal counter
        key = f"<<MATH_{counter:03d}>>"
        math_map[key] = m.group(0)
        counter += 1
        return key

    # Display math first ($$...$$), then inline ($...$)
    text = re.sub(r"\$\$(.+?)\$\$", _replace, text, flags=re.DOTALL)
    text = re.sub(r"(?<!\$)\$(?!\$)(.+?)\$(?!\$)", _replace, text)

    return text, math_map


def restore_math(text: str, math_map: dict[str, str]) -> str:
    """Replace placeholders back with original LaTeX expressions."""
    for key, value in math_map.items():
        text = text.replace(key, value)
    return text


def extract_math_from_segments(
    segments: list[TextSegment],
) -> tuple[list[TextSegment], dict[str, dict[str, str]]]:
    """Extract math from a list of segments.

    Returns (segments_with_placeholders, {segment_id: math_map}).
    """
    new_segments: list[TextSegment] = []
    all_maps: dict[str, dict[str, str]] = {}

    for seg in segments:
        if not seg.text:
            new_segments.append(seg)
            continue
        stripped_text, math_map = extract_math(seg.text)
        new_segments.append(TextSegment(id=seg.id, text=stripped_text, path=seg.path))
        if math_map:
            all_maps[seg.id] = math_map

    return new_segments, all_maps


def restore_math_in_segments(
    segments: list[TextSegment],
    all_maps: dict[str, dict[str, str]],
) -> list[TextSegment]:
    """Restore math placeholders in translated segments."""
    result: list[TextSegment] = []
    for seg in segments:
        math_map = all_maps.get(seg.id)
        if math_map and seg.text:
            restored = restore_math(seg.text, math_map)
            result.append(TextSegment(id=seg.id, text=restored, path=seg.path))
        else:
            result.append(seg)
    return result


def build_messages(
    text: str,
    source_lang: str,
    target_lang: str,
) -> list[ChatMessage]:
    system = (
        "You are a professional translator. "
        "Translate the text accurately, preserving all markdown formatting "
        "(headings, bold, italic, lists, etc.). "
        "Keep all <<MATH_NNN>> placeholders exactly as-is. Do not translate or modify them. "
        "Output only the translated text without any explanation."
    )
    if source_lang and source_lang != "auto":
        user = f"Translate the following from {source_lang} to {target_lang}:\n\n{text}"
    else:
        user = f"Translate the following to {target_lang}:\n\n{text}"

    return [
        ChatMessage(role="system", content=system),
        ChatMessage(role="user", content=user),
    ]


def chunk_segments(
    segments: list[TextSegment],
    max_chars: int = 12_000,
) -> list[list[TextSegment]]:
    """Split segments into chunks that fit within LLM output limits.

    Skips empty-text segments (e.g. images).  Caller must merge them back.
    """
    chunks: list[list[TextSegment]] = []
    current: list[TextSegment] = []
    current_len = 0

    for seg in segments:
        if not seg.text:
            continue
        seg_len = len(seg.text)
        if current and current_len + seg_len > max_chars:
            chunks.append(current)
            current = []
            current_len = 0
        current.append(seg)
        current_len += seg_len

    if current:
        chunks.append(current)

    return chunks


def build_segment_messages(
    segments: list[TextSegment],
    source_lang: str,
    target_lang: str,
) -> list[ChatMessage]:
    seg_lines = [f"[{seg.id}] {seg.text}" for seg in segments if seg.text]
    text = "\n".join(seg_lines)

    system = (
        "You are a professional translator. "
        "Translate each text segment accurately. "
        "Each segment starts with [id]. Keep the [id] markers exactly as-is in your output. "
        "Keep all <code>...</code> and <br> tags exactly as-is. "
        "Keep all <<MATH_NNN>> placeholders exactly as-is. Do not translate or modify them. "
        "Only translate the natural language text between tags and placeholders. "
        "Output only the translated segments."
    )
    if source_lang and source_lang != "auto":
        user = f"Translate the following segments from {source_lang} to {target_lang}:\n\n{text}"
    else:
        user = f"Translate the following segments to {target_lang}:\n\n{text}"

    return [
        ChatMessage(role="system", content=system),
        ChatMessage(role="user", content=user),
    ]


def parse_translated_segments(
    content: str,
    original_segments: list[TextSegment],
) -> list[TextSegment]:
    translated: dict[str, str] = {}
    for match in re.finditer(r"\[(\S+?)\]\s*(.*?)(?=\[\S+?\]|\Z)", content, re.DOTALL):
        seg_id = match.group(1)
        seg_text = match.group(2).strip()
        translated[seg_id] = seg_text

    return [
        TextSegment(
            id=seg.id,
            text=translated.get(seg.id, seg.text),
            path=seg.path,
        )
        for seg in original_segments
    ]
