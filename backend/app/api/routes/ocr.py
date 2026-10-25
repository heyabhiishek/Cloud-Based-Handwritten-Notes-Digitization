from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    Depends
)
from pathlib import Path
from uuid import uuid4
from app.core.config import OCR_SPACE_API_KEY
from app.services.ocr_service import (
    extract_text_from_image,
)
from langdetect import detect, LangDetectException
import asyncio

router = APIRouter(
    prefix="/api",
    tags=["OCR"],
)

LANGUAGE_NAMES = {
    "en": "English",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "it": "Italian",
    "pt": "Portuguese",
    "nl": "Dutch",
    "ru": "Russian",
    "uk": "Ukrainian",
    "ar": "Arabic",
    "hi": "Hindi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "mr": "Marathi",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "kn": "Kannada",
    "ml": "Malayalam",
    "ja": "Japanese",
    "ko": "Korean",
    "zh-cn": "Chinese",
    "zh-tw": "Chinese",
    "tr": "Turkish",
    "pl": "Polish",
    "sv": "Swedish",
    "da": "Danish",
    "fi": "Finnish",
    "el": "Greek",
    "cs": "Czech",
    "hu": "Hungarian",
    "ro": "Romanian",
    "th": "Thai",
    "vi": "Vietnamese",
}

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 1 * 1024 * 1024  # 1 MB
UPLOAD_DIRECTORY = Path(__file__).resolve().parents[3] / "uploads"
FILE_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


@router.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...),
):
    if not OCR_SPACE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "OCR API key is missing. Add or update "
                "OCR_SPACE_API_KEY in backend/.env, then restart the backend."
            ),
        )

    # ============================================================
    # Check file type
    # ============================================================

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Please upload JPG, PNG, or WEBP."
            ),
        )
        
    # ============================================================
    # Read image
    # ============================================================

    image_bytes = await file.read()

    # ============================================================
    # Check file size
    # ============================================================

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size must not exceed 1 MB.",
        )

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    stored_file_path = UPLOAD_DIRECTORY / (
        f"{uuid4().hex}{FILE_EXTENSIONS[file.content_type]}"
    )

    try:
        UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)
        await asyncio.to_thread(stored_file_path.write_bytes, image_bytes)
    except OSError as exc:
        raise HTTPException(
            status_code=500,
            detail="Unable to store uploaded image.",
        ) from exc

    # ============================================================
    # OCR.space — Engine 3 + automatic OCR language detection
    # ============================================================

    try:

        result = await extract_text_from_image(
            image_bytes=image_bytes,
            filename=file.filename or "image.jpg",
        )

    except Exception as exc:

        raise HTTPException(
            status_code=502,
            detail=f"OCR service error: {str(exc)}",
        )

    # ============================================================
    # OCR.space processing error
    # ============================================================

    if result.get("IsErroredOnProcessing"):

        error_message = result.get(
            "ErrorMessage",
            "OCR processing failed.",
        )

        raise HTTPException(
            status_code=502,
            detail=error_message,
        )

    # ============================================================
    # Extract OCR text
    # ============================================================

    parsed_results = result.get("ParsedResults", [])

    extracted_text = "\n".join(
        item.get("ParsedText", "")
        for item in parsed_results
    ).strip()
    
    # ============================================================
    # Detect language from extracted text
    # ============================================================

    detected_language = None
    detected_language_code = None

    if extracted_text:

        try:

            detected_language_code = detect(extracted_text)

            detected_language = LANGUAGE_NAMES.get(
                detected_language_code,
                detected_language_code,
            )

        except LangDetectException:

            detected_language = None
            detected_language_code = None

    # ============================================================
    # Response
    # ============================================================

    return {
        "success": True,
        "filename": file.filename,
        "language": detected_language,
        "language_code": detected_language_code,
        "text": extracted_text,
    }
    