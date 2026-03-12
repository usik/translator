import re

from .schemas import ChatMessage, TextSegment


def build_messages(
    text: str,
    source_lang: str,
    target_lang: str,
) -> list[ChatMessage]:
    system = (
        "You are a professional translator. "
        "Translate the text accurately, preserving all markdown formatting "
        "(headings, bold, italic, lists, etc.). "
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


def build_segment_messages(
    segments: list[TextSegment],
    source_lang: str,
    target_lang: str,
) -> list[ChatMessage]:
    seg_lines = [f"[{seg.id}] {seg.text}" for seg in segments]
    text = "\n".join(seg_lines)

    system = (
        "You are a professional translator. "
        "Translate each text segment accurately. "
        "Each segment starts with [id]. Keep the [id] markers exactly as-is in your output. "
        "Output only the translated segments, one per line."
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
