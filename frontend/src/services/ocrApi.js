
import { API_URL } from "../config";

export async function extractText(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/ocr`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || "OCR processing failed.");
    }

    return data;
}