"use client";

import { useState, useRef } from "react";
import { IconX, IconLoader2, IconUpload, IconFile } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useSubmitClaimMutation, useUploadClaimDocumentMutation } from "../../api/placeEndpoints";
import { claimPlaceSchema } from "../../schemas/placeSchema";

interface ClaimOwnershipModalProps {
	open: boolean;
	onClose: () => void;
	placeId: string;
	placeName: string;
	onClaimSubmitted?: () => void;
}

export function ClaimOwnershipModal({ open, onClose, placeId, placeName, onClaimSubmitted }: ClaimOwnershipModalProps) {
	const [submitClaim, { isLoading }] = useSubmitClaimMutation();
	const [uploadDocument] = useUploadClaimDocumentMutation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [note, setNote] = useState("");
	const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
	const [isUploadingDoc, setIsUploadingDoc] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);

	const resetForm = () => {
		setNote("");
		setUploadedDocs([]);
		setErrors({});
		setSubmitted(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const allowedExts = [".png", ".jpeg", ".jpg", ".gif", ".webp", ".heic", ".heif", ".doc", ".docx", ".pdf", ".txt", ".ppt", ".pptx", ".xls", ".xlsx"];
		const ext = "." + file.name.split(".").pop()?.toLowerCase();
		if (!allowedExts.includes(ext)) {
			toast.error("Invalid file type. Please upload a valid file format (PNG, JPEG, JPG, GIF, WEBP, HEIC, HEIF, DOC, DOCX, PDF, TXT, PPT, PPTX, XLS, XLSX).");
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			toast.error("File must be 10MB or less");
			return;
		}

		setIsUploadingDoc(true);
		try {
			const result = await uploadDocument(file).unwrap();
			setUploadedDocs((prev) => [...prev, result.secure_url]);
			toast.success("Document uploaded");
		} catch {
			toast.error("Failed to upload document");
		} finally {
			setIsUploadingDoc(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const removeDoc = (url: string) => {
		setUploadedDocs((prev) => prev.filter((u) => u !== url));
	};

	const handleSubmit = async () => {
		const result = claimPlaceSchema.safeParse({
			note,
			proofDocuments: uploadedDocs.length > 0 ? uploadedDocs : undefined,
		});

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as string;
				fieldErrors[field] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		try {
			await submitClaim({ placeId, body: result.data }).unwrap();
			toast.success("Claim submitted successfully!");
			setSubmitted(true);
			onClaimSubmitted?.();
		} catch (err: unknown) {
			const apiError = err as { data?: { message?: string }; message?: string };
			const msg = apiError?.data?.message || apiError?.message || "Failed to submit claim";
			toast.error(msg);
			setErrors({ submit: msg });
		}
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="fixed inset-0 bg-black/50" onClick={handleClose} />
			<div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
				<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10 shrink-0">
					<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
						{submitted ? "Claim Submitted" : `Claim "${placeName}"`}
					</h2>
					<button
						type="button"
						onClick={handleClose}
						className="rounded-lg p-1.5 text-[#0D4D4D]/50 hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D] transition-colors cursor-pointer"
					>
						<IconX size={16} />
					</button>
				</div>

				{submitted ? (
					<div className="flex flex-col items-center py-8 px-6 text-center">
						<div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4E8EA] mb-4">
							<svg className="w-8 h-8 text-[#0E808D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-[#0D4D4D] mb-1">Claim Submitted!</h3>
						<p className="text-sm text-[#0D4D4D]/60 max-w-xs">
							Your claim has been submitted for review. We&apos;ll notify you once it&apos;s approved.
						</p>
						<button
							type="button"
							onClick={handleClose}
							className="mt-6 text-[#0E808D] hover:text-[#0E808D]/80 hover:bg-[#0E808D]/5 text-sm font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer"
						>
							Done
						</button>
					</div>
				) : (
					<div className="flex flex-col overflow-y-auto flex-1 min-h-0 custom-scrollbar">
						<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
							<p className="text-sm text-[#0D4D4D]/60 mb-3">
								Provide a note explaining why you should be verified as the owner. Our team will review your claim.
							</p>
							<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Note *</label>
							<textarea
								value={note}
								onChange={(e) => {
									setNote(e.target.value);
									setErrors((prev) => {
										const next = { ...prev };
										delete next.note;
										return next;
									});
								}}
								placeholder="Explain why you should be verified as the owner..."
								rows={4}
								className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]"
							/>
							{errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
						</div>

						<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
							<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Proof Documents</label>
							<input
								ref={fileInputRef}
								type="file"
								accept=".png,.jpeg,.jpg,.gif,.webp,.heic,.heif,.doc,.docx,.pdf,.txt,.ppt,.pptx,.xls,.xlsx"
								onChange={handleDocUpload}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={isUploadingDoc}
								className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#0D4D4D]/20 bg-[#D4E8EA]/30 px-4 py-2.5 text-sm font-medium text-[#0D4D4D]/70 hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D] transition-colors disabled:opacity-50 cursor-pointer"
							>
								{isUploadingDoc ? (
									<IconLoader2 className="w-4 h-4 animate-spin" />
								) : (
									<IconUpload className="w-4 h-4" />
								)}
								{isUploadingDoc ? "Uploading..." : "Upload Document"}
							</button>

							{uploadedDocs.length > 0 && (
								<div className="mt-3 space-y-2">
									{uploadedDocs.map((url) => (
										<div key={url} className="flex items-center gap-2 bg-[#D4E8EA]/50 rounded-lg px-3 py-2">
											<IconFile className="w-4 h-4 text-[#0E808D] shrink-0" />
											<span className="text-xs text-[#0D4D4D]/70 truncate flex-1">
												{url.split("/").pop()}
											</span>
											<button
												type="button"
												onClick={() => removeDoc(url)}
												className="p-0.5 rounded text-[#0D4D4D]/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
											>
												<IconX className="w-3.5 h-3.5" />
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{errors.submit && (
							<div className="px-5 sm:px-6 py-2">
								<p className="text-red-500 text-sm">{errors.submit}</p>
							</div>
						)}

						<div className="px-5 sm:px-6 py-4 flex items-center justify-end gap-3 shrink-0">
							<button
								type="button"
								onClick={handleClose}
								className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-2.5 text-sm font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/50 transition-colors cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isLoading || isUploadingDoc}
								className="inline-flex items-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 cursor-pointer"
							>
								{isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
								{isLoading ? "Submitting..." : "Submit Claim"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
