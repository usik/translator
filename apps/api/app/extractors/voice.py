import asyncio
import logging
import os
import tempfile

from ..schemas import ExtractionResult

logger = logging.getLogger(__name__)


class VoiceExtractor:
    supported_extensions = [".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm"]
    supported_content_types = [
        "audio/mpeg",
        "audio/wav",
        "audio/x-wav",
        "audio/m4a",
        "audio/ogg",
        "audio/flac",
        "audio/webm",
    ]

    def __init__(
        self,
        model_size: str = "base",
        device: str = "cpu",
        compute_type: str = "int8",
    ) -> None:
        self._model_size = model_size
        self._device = device
        self._compute_type = compute_type
        self._model = None

    def _get_model(self):
        if self._model is None:
            from faster_whisper import WhisperModel

            logger.info(
                "Loading faster-whisper model: size=%s, device=%s, compute_type=%s",
                self._model_size,
                self._device,
                self._compute_type,
            )
            self._model = WhisperModel(
                self._model_size,
                device=self._device,
                compute_type=self._compute_type,
            )
            logger.info("faster-whisper model loaded")
        return self._model

    def _transcribe_sync(self, file_bytes: bytes, filename: str) -> tuple[str, dict]:
        model = self._get_model()

        ext = os.path.splitext(filename)[1] or ".wav"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            segments, info = model.transcribe(tmp_path, beam_size=5)
            text_parts = [segment.text for segment in segments]
            full_text = " ".join(text_parts).strip()

            metadata = {
                "language": info.language,
                "language_probability": round(info.language_probability, 4),
                "duration_seconds": round(info.duration, 2),
            }
            return full_text, metadata
        finally:
            os.unlink(tmp_path)

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        text, metadata = await asyncio.to_thread(
            self._transcribe_sync, file_bytes, filename
        )

        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="audio",
            language_detected=metadata.get("language"),
            confidence=metadata.get("language_probability"),
            metadata=metadata,
        )
