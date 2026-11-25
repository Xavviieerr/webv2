"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface FolktaleSelectOption {
	value: string;
	label: string;
}

export function FolktaleSelect({
	id,
	value,
	placeholder,
	options,
	onChange,
	onBlur,
	hasError,
}: {
	id: string;
	value: string;
	placeholder: string;
	options: FolktaleSelectOption[];
	onChange: (value: string) => void;
	onBlur?: () => void;
	hasError?: boolean;
}) {
	return (
		<Select value={value || undefined} onValueChange={onChange}>
			<SelectTrigger
				id={id}
				onBlur={onBlur}
				className={cn(
					"flex h-auto w-full items-center justify-between gap-2 rounded-xl border-2 border-[#0D4D4D]/15 bg-white px-3 py-2.5 text-sm text-[#0D4D4D] outline-none transition-colors focus:border-[#41A3AD] focus-visible:ring-0 focus-visible:ring-offset-0 data-[placeholder]:text-[#0D4D4D]/40 [&>span]:line-clamp-1",
					hasError && "border-red-400",
				)}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent
				position="popper"
				className="z-[60] max-h-72 rounded-xl border border-[#0D4D4D]/15 bg-white p-1 text-[#0D4D4D] shadow-xl shadow-[#0D4D4D]/10"
			>
				{options.map((option) => (
					<SelectItem
						key={option.value}
						value={option.value}
						className="cursor-pointer rounded-lg py-2 pl-2.5 pr-8 focus:bg-[#D4E8EA] focus:text-[#0D4D4D] data-[state=checked]:bg-[#D4E8EA]/70"
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function Field({
	id,
	label,
	required,
	optional,
	hint,
	error,
	children,
}: {
	id: string;
	label: string;
	required?: boolean;
	optional?: boolean;
	hint?: string;
	error?: string;
	children: ReactNode;
}) {
	const { t } = useTranslation("common");

	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-sm font-semibold text-[#0D4D4D]">
				{label}
				{required && (
					<span className="font-normal text-[#0D4D4D]/50">
						{" "}
						({t("requiredLabel")})
					</span>
				)}
				{optional && (
					<span className="font-normal text-[#0D4D4D]/50">
						{" "}
						({t("optional")})
					</span>
				)}
			</label>
			{hint && (
				<p className="text-xs leading-relaxed text-[#0D4D4D]/60">
					{hint}
				</p>
			)}
			{children}
			{error && (
				<p className="text-xs font-medium text-red-600">{error}</p>
			)}
		</div>
	);
}

export function inputClassName(hasError = false): string {
	return cn(
		"w-full rounded-xl border-2 border-[#0D4D4D]/15 bg-white px-3 py-2.5 text-sm text-[#0D4D4D] outline-none transition-colors placeholder:text-[#0D4D4D]/35 focus:border-[#41A3AD]",
		hasError && "border-red-400",
	);
}
