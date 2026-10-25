import { useEffect, useState } from "react";
import { extractText } from "./services/ocrApi";

import ImageUploader from "./components/ImageUploader";
import ImagePreview from "./components/ImagePreview";
import ExtractedText from "./components/ExtractedText";

import "./index.css";

function App() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState("");
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    // New state to hold API metadata (language, language_code, filename)
    const [meta, setMeta] = useState({
        filename: "",
        language: "",
        languageCode: "",
    });

    const handleFileSelect = (selectedFile) => {
        setFile(selectedFile);
        setText("");
        setError("");
        setMeta({ filename: "", language: "", languageCode: "" });
        setStatus("ready");
    };

    const handleExtract = async () => {
        if (!file) return;

        try {
            setStatus("scanning");
            setError("");
            setText("");

            // Authentication is handled automatically by the HttpOnly cookie.
            const result = await extractText(file);

            // Extract and set state from API payload
            setText(result.text || "No text could be detected.");
            setMeta({
                filename: result.filename || file.name,
                language: result.language || "English",
                languageCode: result.language_code || "en",
            });

            setStatus("complete");
        } catch (err) {
            setError(err.message || "Something went wrong.");
            setStatus("ready");
        }
    };

    const reset = () => {
        setFile(null);
        setText("");
        setError("");
        setMeta({ filename: "", language: "", languageCode: "" });
        setStatus("idle");
    };

    return (
        <main className="app">
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="topbar-brand">
                        <div className="topbar-title">
                            AI APPLICATION LAB
                        </div>
                    </div>
                </div>
            </header>

            <section className="workspace">
                {(status === "idle" || status === "complete") && (
                    <ImageUploader
                        onFileSelect={handleFileSelect}
                        onError={setError}
                    />
                )}

                <ImagePreview
                    file={file}
                    status={status}
                    onRemove={reset}
                    onExtract={handleExtract}
                />

                <ExtractedText
                    status={status}
                    meta={meta}
                    text={text}
                    onTextChange={setText}
                    onReset={reset}
                />

                {error && (
                    <div className="docscan-error-message" role="alert">
                        <div className="docscan-error-icon-wrapper">
                            <svg
                                className="docscan-error-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <span className="docscan-error-text">{error}</span>
                    </div>
                )}
            </section>

            <footer className="docscan-footer">
                <div className="docscan-footer-container">
                    {/* Column 1: Lab Title & About Section */}
                    <div className="docscan-footer-col docscan-footer-about">
                        <div className="docscan-footer-header">
                            <span className="docscan-footer-heading">
                                AI APPLICATION LAB
                            </span>
                        </div>
                        <p className="docscan-footer-description">
                            AN INTELLIGENT DOCUMENT SCANNING AND OPTICAL CHARACTER RECOGNITION (OCR) SYSTEM BUILT FOR FAST, HIGH-ACCURACY TEXT EXTRACTION.
                        </p>
                    </div>

                    {/* Column 2: Team Members Section */}
                    <div className="docscan-footer-col docscan-footer-team">
                        <span className="docscan-footer-label">
                            DEVELOPMENT TEAM
                        </span>
                        <ul className="docscan-team-list">
                            <li>DAKSH</li>
                            <li>HARNOOR</li>
                            <li>ABHISHEK</li>
                            <li>SAUMYA</li>
                        </ul>
                    </div>

                    {/* Column 3: Trust & Tech Badges */}
                    <div className="docscan-footer-col docscan-footer-trust">
                        <span className="docscan-footer-label">
                            SYSTEM ARCHITECTURE
                        </span>

                        <div className="docscan-footer-chips">
                            <div className="docscan-chip">
                                <svg
                                    className="docscan-chip-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>PRIVATE BY DESIGN</span>
                            </div>

                            <div className="docscan-chip">
                                <svg
                                    className="docscan-chip-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                </svg>
                                <span>POWERED BY OCR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="docscan-footer-bottom">
                    <span>AI APPLICATION LAB PROJECT</span>
                </div>
            </footer>
        </main>
    );
}

export default App;
