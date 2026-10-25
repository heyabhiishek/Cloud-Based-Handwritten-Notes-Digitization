import { useEffect, useState } from "react";

function ImagePreview({ file, status, onRemove, onExtract }) {
	const [preview, setPreview] = useState("");

	useEffect(() => {
		if (!file) {
			setPreview("");
			return;
		}

		const url = URL.createObjectURL(file);
		setPreview(url);

		return () => URL.revokeObjectURL(url);
	}, [file]);

	if (!["ready", "scanning", "complete"].includes(status)) return null;

	return (
		<div className="document-stage-wrapper">
			<div className="stage-aura aura-pink"></div>
			<div className="stage-aura aura-purple"></div>
			<div className="stage-aura aura-blue"></div>

			<div className="document-stage-card">
				<div className="document-toolbar">
					<div className="document-info">
						<div className="file-icon-badge">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
								<circle cx="8.5" cy="8.5" r="1.5"></circle>
								<polyline points="21 15 16 10 5 21"></polyline>
							</svg>
						</div>

						<div className="file-details">
							<span className="file-name">{file?.name || "Uploaded Document"}</span>
							<span className="file-size">
								{file ? `${(file.size / 1024).toFixed(0)} KB` : "Image preview"}
							</span>
						</div>
					</div>

					{(status === "idle" || status === "ready") && (
						<button className="remove-button" onClick={onRemove}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 6h16" />
								<path d="M8.5 6V4.5A1.5 1.5 0 0 1 10 3h4a1.5 1.5 0 0 1 1.5 1.5V6" />
								<path d="M18 6l-1.15 13.03A2 2 0 0 1 14.86 21H9.14a2 2 0 0 1-1.99-1.97L6 6" />
								<line x1="10" y1="10.5" x2="10.5" y2="16.5" />
								<line x1="14" y1="10.5" x2="13.5" y2="16.5" />
							</svg>
							<span>Remove</span>
						</button>
					)}
				</div>

				<div className="document-viewport">
					<img
						className="document-image"
						src={preview}
						alt="Uploaded handwritten notes"
					/>

					{status === "scanning" && (
						<div className="docscan-scan-overlay">
							<div className="ds-aura-blob ds-aura-pink"></div>
							<div className="ds-aura-blob ds-aura-purple"></div>
							<div className="ds-aura-blob ds-aura-blue"></div>

							<div className="docscan-loading-card">
								<svg
									className="docscan-shine-icon"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M12 2.5L13.7 9.3L20.5 11L13.7 12.7L12 19.5L10.3 12.7L3.5 11L10.3 9.3L12 2.5Z"
										fill="currentColor"
									/>
									<path
										d="M19 16L19.7 18.3L22 19L19.7 19.7L19 22L18.3 19.7L16 19L18.3 18.3L19 16Z"
										fill="currentColor"
									/>
								</svg>

								<span className="docscan-scan-text">
									Reading your document…
								</span>
							</div>
						</div>
					)}
				</div>

				{(status === "ready" || status === "scanning") && (
					<div className="document-footer">
						<button
							className={`primary-scan-button ${status === "scanning" ? "is-scanning" : ""}`}
							onClick={onExtract}
							disabled={status === "scanning"}
						>
							{status === "scanning" ? (
								<svg className="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
									<circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
									<path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
								</svg>
							) : (
								<svg className="scan-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M3 7V5a2 2 0 0 1 2-2h2" />
									<path d="M17 3h2a2 2 0 0 1 2 2v2" />
									<path d="M21 17v2a2 2 0 0 1-2 2h-2" />
									<path d="M7 21H5a2 2 0 0 1-2-2v-2" />
									<line x1="7" y1="12" x2="17" y2="12" />
								</svg>
							)}

							<span>{status === "scanning" ? "Just a few seconds..." : "Scan notes"}</span>

							{status === "ready" && (
								<svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M5 12h14" />
									<path d="m13 6 6 6-6 6" />
								</svg>
							)}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default ImagePreview;
