"use client";

import type { ChangeEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
	value: string;
	label: string;
}

interface FieldProps {
	id: string;
	label: string;
	error?: string;
	optionalLabel?: string;
	requiredLabel?: string;
	children: ReactNode;
}

export function Field({
	id,
	label,
	error,
	optionalLabel,
	requiredLabel,
	children,
}: FieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-sm font-semibold text-[#02474F]">
				{label}
				{requiredLabel && (
					<span className="font-normal text-[#1A4349]/50"> ({requiredLabel})</span>
				)}
				{optionalLabel && (
					<span className="font-normal text-[#1A4349]/50"> ({optionalLabel})</span>
				)}
			</label>
			{children}
			{error && <p className="text-xs font-medium text-red-600">{error}</p>}
		</div>
	);
}

const controlClassName =
	"w-full rounded-xl border-2 border-[#02474F]/15 bg-white px-3 py-2.5 text-sm text-[#02474F] outline-none transition-colors placeholder:text-[#1A4349]/40 focus:border-[#41A3AD]";

interface TextFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: "text" | "tel";
	error?: string;
	optionalLabel?: string;
	requiredLabel?: string;
	onBlur?: () => void;
	autoComplete?: string;
}

export function TextField({
	id,
	label,
	value,
	onChange,
	placeholder,
	type = "text",
	error,
	optionalLabel,
	requiredLabel,
	onBlur,
	autoComplete,
}: TextFieldProps) {
	return (
		<Field
			id={id}
			label={label}
			error={error}
			optionalLabel={optionalLabel}
			requiredLabel={requiredLabel}
		>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				onBlur={onBlur}
				placeholder={placeholder}
				autoComplete={autoComplete}
				className={cn(controlClassName, error && "border-red-400")}
			/>
		</Field>
	);
}

interface SelectFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: ChangeEventHandler<HTMLSelectElement>;
	options: SelectOption[];
	placeholder: string;
	error?: string;
	optionalLabel?: string;
	requiredLabel?: string;
	onBlur?: () => void;
}

export function SelectField({
	id,
	label,
	value,
	onChange,
	options,
	placeholder,
	error,
	optionalLabel,
	requiredLabel,
	onBlur,
}: SelectFieldProps) {
	return (
		<Field
			id={id}
			label={label}
			error={error}
			optionalLabel={optionalLabel}
			requiredLabel={requiredLabel}
		>
			<select
				id={id}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				className={cn(controlClassName, "appearance-none", error && "border-red-400")}
			>
				<option value="">{placeholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</Field>
	);
}

interface CheckboxGroupProps {
	label: string;
	options: SelectOption[];
	values: string[];
	onToggle: (value: string) => void;
	error?: string;
	requiredLabel?: string;
	onBlur?: () => void;
}

export function CheckboxGroup({
	label,
	options,
	values,
	onToggle,
	error,
	requiredLabel,
	onBlur,
}: CheckboxGroupProps) {
	return (
		<fieldset className="flex flex-col gap-2" onBlur={onBlur}>
			<legend className="text-sm font-semibold text-[#02474F]">
				{label}
				{requiredLabel && (
					<span className="font-normal text-[#1A4349]/50"> ({requiredLabel})</span>
				)}
			</legend>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{options.map((option) => {
					const checked = values.includes(option.value);
					return (
						<label
							key={option.value}
							className={cn(
								"flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm transition-colors",
								checked
									? "border-[#02474F] bg-white text-[#02474F]"
									: "border-[#02474F]/15 bg-white/60 text-[#1A4349]/80 hover:border-[#41A3AD] hover:bg-white",
							)}
						>
							<input
								type="checkbox"
								checked={checked}
								onChange={() => onToggle(option.value)}
								className="h-4 w-4 accent-[#02474F]"
							/>
							<span>{option.label}</span>
						</label>
					);
				})}
			</div>
			{error && <p className="text-xs font-medium text-red-600">{error}</p>}
		</fieldset>
	);
}
