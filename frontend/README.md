# OCR Project Frontend

React and Vite interface for uploading an image and viewing its extracted text.

## Requirements

- Node.js and npm
- The backend running at port `8000`

## Run locally

From the `frontend` directory:

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The frontend sends API requests to port `8000` on the same host used to open the page.

## Available scripts

```sh
npm run dev      # Start the Vite development server
npm run build    # Build the production bundle in dist/
npm run preview  # Preview the production bundle
npm run lint     # Run ESLint
```

## OCR workflow

Select a JPG, PNG, or WEBP image, then extract its text. Uploads are limited to 1 MB. The results include detected text and, when available, detected language information. API errors are displayed in the interface; if the OCR key is missing, configure `OCR_SPACE_API_KEY` in `backend/.env` and restart the backend.
