class TextConverter:
    format_name = "text"
    content_type = "text/plain; charset=utf-8"
    file_extension = ".txt"

    async def convert(self, text: str, **options) -> bytes:
        return text.encode("utf-8")
