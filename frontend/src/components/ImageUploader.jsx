import { useRef } from "react";

function ImageUploader({ onFileSelect, onError }) {
	const inputRef = useRef(null);
	const selectFile = (selectedFile) => {
		if (!selectedFile) return;

		if (!selectedFile.type.startsWith("image/")) {
			onError("Please choose an image file.");
			return;
		}

		if (selectedFile.size > 1024 * 1024) {
			onError("The image must be smaller than 1 MB.");
			return;
		}

		onFileSelect(selectedFile);
	};

	const handleInput = (event) => {
		selectFile(event.target.files?.[0]);
		event.target.value = "";
	};

	const handleDrop = (event) => {
		event.preventDefault();
		selectFile(event.dataTransfer.files?.[0]);
	};

	return (
		<div className="drop-zone-wrapper">
			<div className="aura-blob aura-pink"></div>
			<div className="aura-blob aura-purple"></div>
			<div className="aura-blob aura-blue"></div>

			<div
				className="drop-zone"
				onDragOver={(event) => event.preventDefault()}
				onDrop={handleDrop}
				onClick={() => inputRef.current?.click()}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleInput}
				/>

				<div className="drop-zone-content">
					<div className="icon-container">
						<svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="17 8 12 3 7 8"></polyline>
							<line x1="12" y1="3" x2="12" y2="15"></line>
						</svg>
					</div>
					<div className="text-container">
						<span className="primary-text">Choose an image or drag it here</span>
						<span className="secondary-text">Supports JPEG, PNG, or WebP</span>
					</div>
				</div>

				<div className="action-indicator">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="5" y1="12" x2="19" y2="12"></line>
						<polyline points="12 5 19 12 12 19"></polyline>
					</svg>
				</div>
			</div>
		</div>
	);
}

export default ImageUploader;
