"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Mail, MessageCircle } from "lucide-react";
import { classApplicationSchema } from "../schemas/classApplicationSchema";
import { generateApplicationReference } from "../utils/reference";
import {
	AUDIENCE_OPTIONS,
	DIALECT_OPTIONS,
	GOAL_OPTIONS,
	LEVEL_OPTIONS,
	PACKAGE_OPTIONS,
	PRACTICE_TIME_OPTIONS,
	SESSION_TIME_OPTIONS,
} from "../constants/options";
import {
	CheckboxGroup,
	SelectField,
	TextField,
} from "./ClassFormFields";

interface FormState {
	fullName: string;
	phone: string;
	location: string;
	audience: string;
	level: string;
	goals: string[];
	dialect: string;
	sessionTime: string;
	packageInterest: string;
	practiceTime: string;
	message: string;
	consent: boolean;
}

const INITIAL_STATE: FormState = {
	fullName: "",
	phone: "",
	location: "",
	audience: "",
	level: "",
	goals: [],
	dialect: "",
	sessionTime: "",
	packageInterest: "",
	practiceTime: "",
	message: "",
	consent: false,
};

export function ClassApplicationForm() {
	const { t } = useTranslation("common");

	const [form, setForm] = useState<FormState>(INITIAL_STATE);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [reference, setReference] = useState<string | null>(null);

	const update = <Key extends keyof FormState>(
		key: Key,
		value: FormState[Key],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
		if (errors[key]) {
			setErrors((current) => {
				const next = { ...current };
				delete next[key];
				return next;
			});
		}
	};

	const toggleGoal = (value: string) => {
		setForm((current) => ({
			...current,
			goals: current.goals.includes(value)
				? current.goals.filter((goal) => goal !== value)
				: [...current.goals, value],
		}));
		if (errors.goals) {
			setErrors((current) => {
				const next = { ...current };
				delete next.goals;
				return next;
			});
		}
	};

	const translateOptions = (options: { value: string; labelKey: string }[]) =>
		options.map((option) => ({
			value: option.value,
			label: t(option.labelKey),
		}));

	const audienceOptions = useMemo(() => translateOptions(AUDIENCE_OPTIONS), [t]);
	const levelOptions = useMemo(() => translateOptions(LEVEL_OPTIONS), [t]);
	const goalOptions = useMemo(() => translateOptions(GOAL_OPTIONS), [t]);
	const sessionOptions = useMemo(
		() => translateOptions(SESSION_TIME_OPTIONS),
		[t],
	);
	const packageOptions = useMemo(() => translateOptions(PACKAGE_OPTIONS), [t]);
	const practiceOptions = useMemo(
		() => translateOptions(PRACTICE_TIME_OPTIONS),
		[t],
	);
	const dialectOptions = useMemo(
		() =>
			DIALECT_OPTIONS.map((option) => ({
				value: option.value,
				label: option.labelKey ? t(option.labelKey) : (option.label ?? ""),
			})),
		[t],
	);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const parsed = classApplicationSchema.safeParse(form);
		if (!parsed.success) {
			const fieldErrors: Record<string, string> = {};
			parsed.error.issues.forEach((issue) => {
				fieldErrors[String(issue.path[0])] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		setErrors({});
		setReference(generateApplicationReference());
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (reference) {
		return <ApplicationSuccess reference={reference} />;
	}

	return (
		<section
			id="apply"
			className="flex scroll-mt-24 flex-col gap-5 rounded-3xl border-2 border-[#D4E8EA] bg-[#FBF5EA] p-5 sm:p-7"
		>
			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
					{t("classFormTitle")}
				</h2>
				<p className="text-sm text-[#1A4349]/70">{t("classFormDescription")}</p>
			</div>

			<form onSubmit={handleSubmit} className="flex flex-col gap-5">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<TextField
						id="class-full-name"
						label={t("fullNameLabel")}
						placeholder={t("fullNamePlaceholder")}
						value={form.fullName}
						onChange={(value) => update("fullName", value)}
						error={errors.fullName ? t(errors.fullName) : undefined}
						autoComplete="name"
					/>
					<TextField
						id="class-phone"
						type="tel"
						label={t("whatsappLabel")}
						placeholder="+234 800 000 0000"
						value={form.phone}
						onChange={(value) => update("phone", value)}
						error={errors.phone ? t(errors.phone) : undefined}
						autoComplete="tel"
					/>
					<TextField
						id="class-location"
						label={t("basedInLabel")}
						placeholder="Lagos, Nigeria"
						value={form.location}
						onChange={(value) => update("location", value)}
						error={errors.location ? t(errors.location) : undefined}
					/>
					<SelectField
						id="class-audience"
						label={t("whoIsThisFor")}
						placeholder={t("whoIsThisFor")}
						value={form.audience}
						onChange={(event) => update("audience", event.target.value)}
						options={audienceOptions}
						error={errors.audience ? t(errors.audience) : undefined}
					/>
					<SelectField
						id="class-level"
						label={t("urhoboLevelLabel")}
						placeholder={t("urhoboLevelLabel")}
						value={form.level}
						onChange={(event) => update("level", event.target.value)}
						options={levelOptions}
						error={errors.level ? t(errors.level) : undefined}
					/>
					<SelectField
						id="class-dialect"
						label={t("dialectLabel")}
						placeholder={t("dialectUnknown")}
						value={form.dialect}
						onChange={(event) => update("dialect", event.target.value)}
						options={dialectOptions}
						error={errors.dialect ? t(errors.dialect) : undefined}
					/>
				</div>

				<CheckboxGroup
					label={t("goalLabel")}
					options={goalOptions}
					values={form.goals}
					onToggle={toggleGoal}
					error={errors.goals ? t(errors.goals) : undefined}
				/>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<SelectField
						id="class-session"
						label={t("preferredSessionTime")}
						placeholder={t("preferredSessionTime")}
						value={form.sessionTime}
						onChange={(event) => update("sessionTime", event.target.value)}
						options={sessionOptions}
						error={errors.sessionTime ? t(errors.sessionTime) : undefined}
					/>
					<SelectField
						id="class-package"
						label={t("packageInterest")}
						placeholder={t("packageNotSure")}
						value={form.packageInterest}
						onChange={(event) =>
							update("packageInterest", event.target.value)
						}
						options={packageOptions}
						error={
							errors.packageInterest ? t(errors.packageInterest) : undefined
						}
					/>
					<SelectField
						id="class-practice"
						label={t("practiceTimeLabel")}
						placeholder={t("practiceTimeLabel")}
						value={form.practiceTime}
						onChange={(event) => update("practiceTime", event.target.value)}
						options={practiceOptions}
						error={errors.practiceTime ? t(errors.practiceTime) : undefined}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="class-message"
						className="text-sm font-semibold text-[#02474F]"
					>
						{t("messageLabel")}{" "}
						<span className="font-normal text-[#1A4349]/50">
							({t("optional")})
						</span>
					</label>
					<textarea
						id="class-message"
						rows={4}
						maxLength={1000}
						value={form.message}
						onChange={(event) => update("message", event.target.value)}
						placeholder={t("messagePlaceholder")}
						className="w-full resize-y rounded-xl border-2 border-[#D4E8EA] bg-white px-3 py-2.5 text-sm text-[#02474F] outline-none transition-colors placeholder:text-[#1A4349]/40 focus:border-[#41A3AD]"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="flex cursor-pointer items-start gap-3 text-sm text-[#1A4349]/80">
						<input
							type="checkbox"
							checked={form.consent}
							onChange={(event) => update("consent", event.target.checked)}
							className="mt-0.5 h-4 w-4 accent-[#02474F]"
						/>
						<span>{t("consentContact")}</span>
					</label>
					{errors.consent && (
						<p className="text-xs font-medium text-red-600">
							{t(errors.consent)}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
				>
					{t("submitClassApplication")}
				</button>

				<p className="text-center text-[11px] text-[#1A4349]/50">
					{t("classFormFootnote")}
				</p>
			</form>
		</section>
	);
}

function ApplicationSuccess({ reference }: { reference: string }) {
	const { t } = useTranslation("common");

	return (
		<section
			id="apply"
			className="flex scroll-mt-24 flex-col items-center gap-4 rounded-3xl border-2 border-[#41A3AD] bg-[#D4E8EA] p-6 text-center sm:p-10"
		>
			<span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#02474F] text-white">
				<CheckCircle2 className="h-7 w-7" />
			</span>
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("classSuccessTitle")}
			</h2>
			<p className="max-w-xl text-sm leading-relaxed text-[#1A4349]/80">
				{t("classSuccessDescription")}
			</p>

			<div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-6 py-4">
				<span className="text-[11px] font-bold uppercase tracking-widest text-[#1A4349]/60">
					{t("classReferenceLabel")}
				</span>
				<span className="text-2xl font-bold tracking-wide text-[#0E808D]">
					{reference}
				</span>
			</div>

			<p className="text-xs text-[#1A4349]/60">{t("classSuccessNote")}</p>

			<div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#02474F]">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
					<Clock className="h-3.5 w-3.5" /> {t("classFormFootnote")}
				</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
					<MessageCircle className="h-3.5 w-3.5" /> WhatsApp
				</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
					<Mail className="h-3.5 w-3.5" /> email
				</span>
			</div>

			<Link
				href="/classes"
				className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{t("exploreClasses")}
			</Link>
		</section>
	);
}
