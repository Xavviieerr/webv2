"use client";

import { IconLoader2, IconX } from "@tabler/icons-react";

interface ImagePreviewProps {
	preview: string;
	isUploading: boolean;
	onRemove: () => void;
}

export function ImagePreview({ preview, isUploading, onRemove }: ImagePreviewProps) {
	return (
		<div className="relative inline-block rounded-lg overflow-hidden border border-[#02474F]/15 mb-2">
			<img src={preview} alt="Preview" className="h-28 object-cover" />
			{isUploading && (
				<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
					<IconLoader2 className="w-5 h-5 text-white animate-spin" />
				</div>
			)}
			<button
				type="button"
				onClick={onRemove}
				className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
			>
				<IconX className="w-3 h-3" />
			</button>
		</div>
	);
}
