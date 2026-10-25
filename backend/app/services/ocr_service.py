import httpx

from app.core.config import (
    OCR_SPACE_API_KEY,
    OCR_SPACE_API_URL,
)


async def extract_text_from_image(
    image_bytes: bytes,
    filename: str,
) -> dict:

    files = {
        "file": (
            filename,
            image_bytes,
        )
    }

    data = {
        "language": "auto",
        "OCREngine": "3",
        "isOverlayRequired": "false",
        "detectOrientation": "true",
        "scale": "true",
    }

    headers = {
        "apikey": OCR_SPACE_API_KEY,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:

        response = await client.post(
            OCR_SPACE_API_URL,
            headers=headers,
            data=data,
            files=files,
        )

    response.raise_for_status()

    return response.json()