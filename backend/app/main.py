from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.ocr import router as ocr_router


app = FastAPI(
    title="Handwritten Notes OCR API",
    description="Convert handwritten notes images into digital text.",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ocr_router)

@app.get("/")
async def root():
    return {
        "message": "Handwritten Notes OCR API is running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }