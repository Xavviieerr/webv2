"use client";

import { useState, useEffect } from "react";
import { IconX, IconLoader2 } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useUpdateBusinessProfileMutation } from "../../api/placeEndpoints";
import type { PlaceListItem } from "../../types";

interface EditBusinessModalProps {
	open: boolean;
	onClose: () => void;
	place: PlaceListItem;
	onSaved: () => void;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const DAY_LABELS: Record<string, string> = {
	monday: "Mon",
	tuesday: "Tue",
	wednesday: "Wed",
	thursday: "Thu",
	friday: "Fri",
	saturday: "Sat",
	sunday: "Sun",
};

type DayHours = { open: string; close: string; closed: boolean };

function getDefaultHours(): Record<string, DayHours> {
	const base: Record<string, DayHours> = {};
	for (const day of DAYS) {
		base[day] = { open: "09:00", close: "17:00", closed: day === "sunday" };
	}
	return base;
}

function parseOpeningHours(
	hours: Record<string, { open?: string; close?: string; closed?: boolean }> | undefined,
): Record<string, DayHours> {
	const result = getDefaultHours();
	if (!hours || typeof hours !== "object") return result;
	for (const day of DAYS) {
		const h = hours[day];
		if (h) {
			result[day] = {
				open: h.open || "09:00",
				close: h.close || "17:00",
				closed: !!h.closed,
			};
		}
	}
	return result;
}

export function EditBusinessModal({ open, onClose, place, onSaved }: EditBusinessModalProps) {
	const [updateBusinessProfile, { isLoading }] = useUpdateBusinessProfileMutation();

	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [website, setWebsite] = useState("");
	const [category, setCategory] = useState("");
	const [openingHours, setOpeningHours] = useState<Record<string, DayHours>>(getDefaultHours);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const bp = place.businessProfile;

	useEffect(() => {
		if (!open || !bp) return;
		setPhoneNumber(bp.phoneNumber ?? "");
		setEmail(bp.email ?? "");
		setWebsite(bp.website ?? "");
		setCategory(bp.category ?? "");
		setOpeningHours(parseOpeningHours(bp.openingHours));
		setErrors({});
	}, [open, bp]);

	const resetForm = () => {
		setPhoneNumber("");
		setEmail("");
		setWebsite("");
		setCategory("");
		setOpeningHours(getDefaultHours());
		setErrors({});
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const toggleDayClosed = (day: string) => {
		setOpeningHours((prev) => ({
			...prev,
			[day]: { ...prev[day], closed: !prev[day].closed },
		}));
	};

	const updateDayTime = (day: string, field: "open" | "close", value: string) => {
		setOpeningHours((prev) => ({
			...prev,
			[day]: { ...prev[day], [field]: value },
		}));
	};

	const handleSubmit = async () => {
		const newErrors: Record<string, string> = {};
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Invalid email address";
		}
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const oh: Record<string, { open?: string; close?: string; closed?: boolean }> = {};
		for (const day of DAYS) {
			const h = openingHours[day];
			if (h.closed) {
				oh[day] = { closed: true };
			} else {
				oh[day] = { open: h.open, close: h.close };
			}
		}

		try {
			await updateBusinessProfile({
				placeId: place.id,
				body: {
					...(phoneNumber && { phoneNumber }),
					...(email && { email }),
					...(website && { website }),
					...(category && { category }),
					openingHours: oh,
				},
			}).unwrap();
			toast.success("Business profile updated!");
			setErrors({});
			onSaved();
			handleClose();
		} catch (err: unknown) {
			const apiError = err as { data?: { message?: string }; message?: string };
			const msg = apiError?.data?.message || apiError?.message || "Failed to update business profile";
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
						Edit Business Information
					</h2>
					<button
						type="button"
						onClick={handleClose}
						className="rounded-lg p-1.5 text-[#0D4D4D]/50 hover:bg-[#D4E8EA]/50 hover:text-[#0D4D4D] transition-colors cursor-pointer"
					>
						<IconX size={16} />
					</button>
				</div>

				<div className="flex flex-col overflow-y-auto flex-1 min-h-0 custom-scrollbar">
					<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
						<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Phone Number</label>
						<input
							type="tel"
							value={phoneNumber}
							onChange={(e) => {
								setPhoneNumber(e.target.value);
								setErrors((prev) => { const n = { ...prev }; delete n.phoneNumber; return n; });
							}}
							placeholder="+234 xxx xxx xxxx"
							className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
						/>
						{errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
					</div>

					<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
						<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
							}}
							placeholder="business@example.com"
							className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
						/>
						{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
					</div>

					<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
						<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Website</label>
						<input
							type="url"
							value={website}
							onChange={(e) => {
								setWebsite(e.target.value);
								setErrors((prev) => { const n = { ...prev }; delete n.website; return n; });
							}}
							placeholder="https://example.com"
							className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
						/>
						{errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
					</div>

					<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
						<label className="text-[#0D4D4D]/50 text-sm font-medium mb-1.5 block">Category</label>
						<input
							type="text"
							value={category}
							onChange={(e) => {
								setCategory(e.target.value);
								setErrors((prev) => { const n = { ...prev }; delete n.category; return n; });
							}}
							placeholder="e.g., Restaurant, Retail, Services"
							className="w-full h-11 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-3 py-2 text-sm text-[#0D4D4D] placeholder:text-[#0D4D4D]/30 outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
						/>
						{errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
					</div>

					<div className="px-5 sm:px-6 py-3 border-b border-[#0D4D4D]/10">
						<label className="text-[#0D4D4D]/50 text-sm font-medium mb-2 block">Opening Hours</label>
						<div className="space-y-2">
							{DAYS.map((day) => {
								const h = openingHours[day];
								return (
									<div key={day} className="flex items-center gap-2">
										<span className="text-sm font-medium text-[#0D4D4D] w-10 shrink-0">
											{DAY_LABELS[day]}
										</span>

										<button
											type="button"
											onClick={() => toggleDayClosed(day)}
											className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
												h.closed ? "bg-[#0D4D4D]/20" : "bg-[#0E808D]"
											}`}
										>
											<span
												className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
													h.closed ? "translate-x-4.5" : "translate-x-0.5"
												}`}
											/>
										</button>
										<span className="text-xs text-[#0D4D4D]/50 w-12 shrink-0">
											{h.closed ? "Closed" : "Open"}
										</span>

										{!h.closed && (
											<div className="flex items-center gap-1.5 flex-1">
												<input
													type="time"
													value={h.open}
													onChange={(e) => updateDayTime(day, "open", e.target.value)}
													className="flex-1 h-8 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-2 text-xs text-[#0D4D4D] outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
												/>
												<span className="text-xs text-[#0D4D4D]/40">—</span>
												<input
													type="time"
													value={h.close}
													onChange={(e) => updateDayTime(day, "close", e.target.value)}
													className="flex-1 h-8 rounded-lg border border-[#0D4D4D]/15 bg-[#D4E8EA]/30 px-2 text-xs text-[#0D4D4D] outline-none focus-visible:ring-2 focus-visible:ring-[#0E808D] focus-visible:border-[#0E808D] transition-colors"
												/>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>

					{errors.submit && (
						<div className="px-5 sm:px-6 py-2">
							<p className="text-red-500 text-sm">{errors.submit}</p>
						</div>
					)}
				</div>

				<div className="px-5 sm:px-6 py-4 flex items-center justify-end gap-3 border-t border-[#0D4D4D]/10 shrink-0">
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
						disabled={isLoading}
						className="inline-flex items-center gap-2 rounded-lg bg-[#0E808D] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0E808D]/90 disabled:opacity-50 cursor-pointer"
					>
						{isLoading && <IconLoader2 className="w-4 h-4 animate-spin" />}
						{isLoading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}
