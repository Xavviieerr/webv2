"use client";

import { useRef } from "react";
import { IconX, IconLoader2, IconPhoto } from "@tabler/icons-react";
import { useUploadPlaceImageMutation } from "../../api/placeEndpoints";

interface EditImagesSectionProps {
	images: string[];
	onChange: (images: string[]) => void;
}

export function EditImagesSection({ images, onChange }: EditImagesSectionProps) {
	const [uploadImage, { isLoading: isUploading }] = useUploadPlaceImageMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) return;

		try {
			const result = await uploadImage(file).unwrap();
			onChange([...images, result.large]);
		} catch {
			// silently fail
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemove = (index: number) => {
		onChange(images.filter((_, i) => i !== index));
	};

	return (
		<div>
			<label className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">Images</label>
			<div className="flex flex-wrap gap-2">
				{images.map((url, i) => (
					<div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-[#02474F]/10">
						<img src={url} alt="" className="w-full h-full object-cover" />
						<button
							type="button"
							onClick={() => handleRemove(i)}
							className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white opacity-100 transition-opacity cursor-pointer"
						>
							<IconX size={12} />
						</button>
					</div>
				))}

				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading}
					className="w-20 h-20 rounded-lg border-2 border-dashed border-[#02474F]/20 flex flex-col items-center justify-center gap-1 text-[#0D4D4D]/40 hover:border-[#0E808D]/50 hover:text-[#0E808D] transition-colors cursor-pointer disabled:opacity-50"
				>
					{isUploading ? (
						<IconLoader2 size={18} className="animate-spin" />
					) : (
						<IconPhoto size={18} />
					)}
					<span className="text-[10px]">{isUploading ? "..." : "Add"}</span>
				</button>
			</div>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleUpload}
				className="hidden"
			/>
		</div>
	);
}
