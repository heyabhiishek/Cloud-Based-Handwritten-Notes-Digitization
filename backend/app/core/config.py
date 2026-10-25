import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIRECTORY / ".env")


OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY", "").strip()
OCR_SPACE_API_URL = os.getenv(
    "OCR_SPACE_API_URL",
    "https://api.ocr.space/parse/image",
)