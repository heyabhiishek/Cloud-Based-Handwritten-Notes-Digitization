import { useState } from "react";

function ExtractedText({
	status,
	meta,
	text,
	onTextChange,
	onReset,
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1800);
	};

	const handleDownload = () => {
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = `${meta.filename || "digital-notes"}.txt`;
		link.click();

		URL.revokeObjectURL(url);
	};

	if (status !== "complete") return null;

	return (
		<div className="result-view">
			<div className="docscan-result-heading">
				<div>
					<div className="docscan-heading-group">
						<div className="docscan-status-segmented-pill">
							<span className="docscan-badge-dot" />
							<span className="docscan-segmented-label">Transcription</span>

							{meta.language && (
								<>
									<span className="docscan-segmented-divider">•</span>
									<span className="docscan-segmented-value">
										{meta.language}
										{meta.languageCode && (
											<span className="docscan-lang-code">{meta.languageCode.toUpperCase()}</span>
										)}
									</span>
								</>
							)}
						</div>

						<div className="docscan-title-row">
							<svg
								className="docscan-success-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 6L9 17l-5-5" />
							</svg>
							<h2 className="docscan-result-title">Your notes are ready</h2>
						</div>
					</div>
				</div>

				<button
					type="button"
					className="docscan-text-button"
					onClick={onReset}
				>
					<svg
						className="docscan-reset-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
						<path d="M21 3v5h-5" />
						<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
						<path d="M3 21v-5h5" />
					</svg>
					<span>New scan</span>
				</button>
			</div>

			<div className="docscan-result-card">
				<div className="docscan-result-toolbar">
					<div className="docscan-toolbar-title">
						<svg
							className="docscan-toolbar-icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="16" y1="13" x2="8" y2="13" />
							<line x1="16" y1="17" x2="8" y2="17" />
							<line x1="10" y1="9" x2="8" y2="9" />
						</svg>
						<span>Digital text</span>
					</div>

					<div className="docscan-result-actions">
						<button
							type="button"
							className={`docscan-action-btn ${copied ? "docscan-copied" : ""}`}
							onClick={handleCopy}
						>
							{copied ? (
								<svg className="docscan-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="20 6 9 17 4 12" />
								</svg>
							) : (
								<svg className="docscan-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
									<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
								</svg>
							)}
							<span>{copied ? "Copied" : "Copy"}</span>
						</button>

						<button
							type="button"
							className="docscan-action-btn"
							onClick={handleDownload}
						>
							<svg className="docscan-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							<span>Download</span>
						</button>
					</div>
				</div>

				<textarea
					className="docscan-textarea"
					value={text}
					onChange={(event) => onTextChange(event.target.value)}
					spellCheck={false}
					placeholder="Extracted text will appear here..."
				/>
			</div>

			<div>
				<button
					type="button"
					className="docscan-text-button-mobile"
					onClick={onReset}
				>
					<svg
						className="docscan-reset-icon"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
						<path d="M21 3v5h-5" />
						<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
						<path d="M3 21v-5h5" />
					</svg>
					<span>New scan</span>
				</button>
			</div>
		</div>
	);
}

export default ExtractedText;
