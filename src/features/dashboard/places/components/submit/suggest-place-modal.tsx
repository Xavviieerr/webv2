"use client";

import { useState } from "react";
import { IconX, IconLoader2 } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useSuggestPlaceMutation } from "../../api/placeEndpoints";
import { suggestPlaceSchema } from "../../schemas/placeSchema";
import { PLACE_TYPES } from "../../constants";

interface SuggestPlaceModalProps {
	open: boolean;
	onClose: () => void;
}

export function SuggestPlaceModal({ open, onClose }: SuggestPlaceModalProps) {
	const [suggestPlace, { isLoading: isSubmitting }] = useSuggestPlaceMutation();

	const [step, setStep] = useState(1);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");
	const [tags, setTags] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);

	const resetForm = () => {
		setStep(1);
		setName("");
		setDescription("");
		setType("");
		setTags("");
		setAddress("");
		setCity("");
		setState("");
		setCountry("");
		setLatitude("");
		setLongitude("");
		setErrors({});
		setSubmitted(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleStep1Continue = () => {
		const newErrors: Record<string, string> = {};
		if (!name.trim()) newErrors.name = "Name is required";
		if (!description.trim()) newErrors.description = "Description is required";
		if (description.trim().length > 0 && description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
		if (!type) newErrors.type = "Type is required";
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		setStep(2);
	};

	const handleSubmit = async () => {
		const parsedTags = tags
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		const locationObj =
			city || state || country || address || latitude || longitude
				? {
						city: city || undefined,
						state: state || undefined,
						country: country || undefined,
						address: address || undefined,
						latitude: latitude ? parseFloat(latitude) : undefined,
						longitude: longitude ? parseFloat(longitude) : undefined,
					}
				: undefined;

		const result = suggestPlaceSchema.safeParse({
			name,
			description,
			type,
			tags: parsedTags.length > 0 ? parsedTags : undefined,
			location: locationObj,
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
			await suggestPlace(result.data).unwrap();
			toast.success("Place submitted successfully!");
			setSubmitted(true);
		} catch (err: unknown) {
			const apiError = err as { data?: { message?: string }; message?: string };
			const msg = apiError?.data?.message || apiError?.message || "Failed to submit place";
			toast.error(msg);
			setErrors({ submit: msg });
		}
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="fixed inset-0 bg-black/50" onClick={handleClose} />
			<div className="relative bg-[#F2FEFF] rounded-2xl border border-[#0D4D4D]/10 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
				<div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between border-b border-[#0D4D4D]/10 shrink-0">
					<h2 className="text-xs font-semibold uppercase tracking-wide text-[#0D4D4D]">
						{submitted ? "Thank You!" : step === 1 ? "Suggest a Place — Step 1 of 2" : "Suggest a Place — Step 2 of 2"}
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
						<h3 className="text-lg font-semibold text-[#0D4D4D] mb-1">Place Submitted!</h3>
						<p className="text-sm text-[#0D4D4D]/60 max-w-xs">
							Your suggestion has been submitted for review. We&apos;ll notify you once it&apos;s approved.
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
						{step === 1 ? (
							<div className="flex flex-col">
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Name *</label>
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g., Central Park"
										className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
									/>
									{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
								</div>
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Type *</label>
									<select
										value={type}
										onChange={(e) => setType(e.target.value)}
										className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors cursor-pointer"
									>
										<option value="">Select a type</option>
										{PLACE_TYPES.map((t) => (
											<option key={t.value} value={t.value}>
												{t.label}
											</option>
										))}
									</select>
									{errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
								</div>
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Description * (min 10 characters)</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Describe the place..."
										rows={3}
										className="w-full rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-3 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus:ring-2 focus:ring-[#0E808D] focus:border-[#0E808D] transition-colors resize-y min-h-[120px]"
									/>
									{errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
								</div>
								<div className="px-5 sm:px-6 py-4 flex items-center justify-end shrink-0">
									<button
										type="button"
										onClick={handleStep1Continue}
										className="rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 cursor-pointer"
									>
										Continue
									</button>
								</div>
							</div>
						) : (
							<div className="flex flex-col">
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Tags (comma-separated)</label>
									<input
										type="text"
										value={tags}
										onChange={(e) => setTags(e.target.value)}
										placeholder="e.g., nature, tourist attraction"
										className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
									/>
								</div>
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Address</label>
									<input
										type="text"
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										placeholder="Street address"
										className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
									/>
								</div>
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">City</label>
											<input
												type="text"
												value={city}
												onChange={(e) => setCity(e.target.value)}
												placeholder="City"
												className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
											/>
										</div>
										<div>
											<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">State</label>
											<input
												type="text"
												value={state}
												onChange={(e) => setState(e.target.value)}
												placeholder="State"
												className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
											/>
										</div>
									</div>
								</div>
								<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
									<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Country</label>
									<input
										type="text"
										value={country}
										onChange={(e) => setCountry(e.target.value)}
										placeholder="Country"
										className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
									/>
								</div>

								{errors.submit && (
									<div className="px-5 sm:px-6 py-2">
										<p className="text-red-500 text-sm">{errors.submit}</p>
									</div>
								)}

								<div className="px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
									<button
										type="button"
										onClick={() => setStep(1)}
										className="rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-4 py-2.5 text-sm font-medium text-[#0D4D4D] hover:bg-[#D4E8EA]/50 transition-colors cursor-pointer"
									>
										Back
									</button>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={isSubmitting}
									className="inline-flex items-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 cursor-pointer"
								>
									{isSubmitting && <IconLoader2 className="w-4 h-4 animate-spin" />}
									{isSubmitting ? "Submitting..." : "Submit for Review"}
								</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
