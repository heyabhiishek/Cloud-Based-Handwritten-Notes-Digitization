# OCR Project Backend

FastAPI service that accepts image uploads, sends them to OCR.space for text extraction, and detects the language of the extracted text.

## Requirements

- Python 3.10 or later
- An OCR.space API key

## Setup

From the `backend` directory, create and activate a virtual environment, then install dependencies:

```sh
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

macOS or Linux:

```sh
source .venv/bin/activate
```

Then, for any platform:

```sh
pip install -r requirements.txt
```

Create or update `backend/.env` with your OCR.space API key:

```dotenv
OCR_SPACE_API_KEY=your_ocr_space_api_key
```

`OCR_SPACE_API_URL` is optional; it defaults to `https://api.ocr.space/parse/image`. Keep the API key private and do not commit its value. Restart the backend after changing `.env`.

## Run locally

From the `backend` directory:

```sh
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive API documentation is available at `http://localhost:8000/docs`; the health endpoint is `http://localhost:8000/health`.

## API

### `POST /api/ocr`

Submit one multipart form field named `file`. Supported formats are JPG/JPEG, PNG, and WEBP; the maximum file size is 1 MB.

On success, the JSON response contains:

- `success`: whether processing succeeded
- `filename`: uploaded filename
- `language` and `language_code`: detected language, when available
- `text`: extracted text

If `OCR_SPACE_API_KEY` is unset or blank, the endpoint responds with HTTP `503` and instructions to update `OCR_SPACE_API_KEY` in `backend/.env`.
