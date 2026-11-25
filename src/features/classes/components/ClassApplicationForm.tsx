"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
	ArrowRight,
	Check,
	CheckCircle2,
	Clock,
	Lock,
	Mail,
	MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/types/hooks";
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
import { CheckboxGroup, SelectField, TextField } from "./ClassFormFields";
import { ClassesSection } from "./ClassesSection";
import { useClassesPackage } from "./ClassesPackageContext";

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

type Step = 1 | 2 | 3;

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

const STEP_FIELDS: Record<Step, (keyof FormState)[]> = {
	1: ["audience", "goals"],
	2: ["level", "dialect", "practiceTime"],
	3: [
		"fullName",
		"phone",
		"location",
		"sessionTime",
		"packageInterest",
		"consent",
	],
};

const STEP_KEYS: Record<Step, string> = {
	1: "stepGoal",
	2: "stepLevel",
	3: "stepDetails",
};

export function ClassApplicationForm() {
	const { t } = useTranslation("common");
	const { selectedPackage } = useClassesPackage();
	const user = useAppSelector((state) => state.auth.user);
	const isSignedIn = Boolean(user);
	const signInHref = `/signin?next=${encodeURIComponent("/classes#apply")}`;

	const [step, setStep] = useState<Step>(1);
	const [form, setForm] = useState<FormState>(INITIAL_STATE);
	const [reference, setReference] = useState<string | null>(null);
	// A field only shows its error after the applicant has interacted with it
	// and left it invalid, so a freshly opened step is never covered in red.
	const [touched, setTouched] = useState<
		Partial<Record<keyof FormState, boolean>>
	>({});

	// A plan chosen in the pricing grid applies until the applicant overrides
	// it in the form, so the two views can never disagree. "Not sure yet" is a
	// valid answer, so it is the default rather than an empty required field.
	const effectivePackage = form.packageInterest || selectedPackage || "not-sure";
	const effectiveForm = useMemo(
		() => ({ ...form, packageInterest: effectivePackage }),
		[form, effectivePackage],
	);

	const formErrors = useMemo(() => {
		const parsed = classApplicationSchema.safeParse(effectiveForm);
		if (parsed.success) return {} as Record<string, string>;

		const fieldErrors: Record<string, string> = {};
		parsed.error.issues.forEach((issue) => {
			fieldErrors[String(issue.path[0])] = issue.message;
		});
		return fieldErrors;
	}, [effectiveForm]);

	const isFormValid = Object.keys(formErrors).length === 0;

	const stepErrors = useMemo(() => {
		const scoped: Record<string, string> = {};
		STEP_FIELDS[step].forEach((field) => {
			if (formErrors[field]) scoped[field] = formErrors[field];
		});
		return scoped;
	}, [formErrors, step]);

	const isStepValid = Object.keys(stepErrors).length === 0;

	// Errors are derived, never accumulated: a field keeps its error only while
	// it is still invalid and has already been visited.
	const errors = useMemo(() => {
		const visible: Record<string, string> = {};
		Object.entries(stepErrors).forEach(([field, message]) => {
			if (touched[field as keyof FormState]) visible[field] = message;
		});
		return visible;
	}, [stepErrors, touched]);

	const markTouched = (field: keyof FormState) => {
		setTouched((current) =>
			current[field] ? current : { ...current, [field]: true },
		);
	};

	const update = <Key extends keyof FormState>(
		key: Key,
		value: FormState[Key],
	) => {
		setForm((current) => ({ ...current, [key]: value }));
	};

	const toggleGoal = (value: string) => {
		setForm((current) => ({
			...current,
			goals: current.goals.includes(value)
				? current.goals.filter((goal) => goal !== value)
				: [...current.goals, value],
		}));
		markTouched("goals");
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

	const packageLabel = useMemo(() => {
		const option = PACKAGE_OPTIONS.find(
			(candidate) => candidate.value === effectivePackage,
		);
		return t(option?.labelKey ?? "packageNotSure");
	}, [effectivePackage, t]);

	const scrollToStart = () => {
		document
			.getElementById("apply")
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const moveTo = (target: Step) => {
		setStep(target);
		scrollToStart();
	};

	const goNext = () => {
		if (!isStepValid) return;
		moveTo((step === 3 ? step : step + 1) as Step);
	};

	const goBack = () => {
		moveTo((step === 1 ? step : step - 1) as Step);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Applications are tied to an account, so signed-out visitors can fill
		// the form but cannot send it until they sign in.
		if (!isSignedIn) return;

		// The button is gated on validity, so this is only a safety net.
		if (!isFormValid) {
			STEP_FIELDS[step].forEach(markTouched);
			return;
		}

		setReference(generateApplicationReference());
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	if (reference) {
		return <ApplicationSuccess reference={reference} />;
	}

	return (
		<ClassesSection id="apply" tone="tint">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
				<div className="rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-5 shadow-[0_24px_60px_-50px_rgba(2,71,79,0.7)] sm:p-8">
					<div className="flex flex-col gap-2">
						<span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0E808D]">
							{t("applyEyebrow")}
						</span>
						<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
							{t("classFormTitle")}
						</h2>
						<p className="text-sm text-[#1A4349]/70">
							{t("classFormDescription")}
						</p>
					</div>

					{selectedPackage && (
						<div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FBF5EA] px-4 py-3">
							<p className="text-xs text-[#1A4349]/70">
								{t("selectedPackageLabel")}:{" "}
								<span className="font-bold text-[#02474F]">{packageLabel}</span>
							</p>
							<Link
								href="#pricing"
								className="text-[11px] font-semibold text-[#0E808D] hover:underline"
							>
								{t("selectedPackageNote")}
							</Link>
						</div>
					)}

					<div className="mt-5 grid grid-cols-3 gap-2">
						{([1, 2, 3] as Step[]).map((index) => {
							const active = step === index;
							const done = step > index;
							return (
								<button
									key={index}
									type="button"
									onClick={() => {
										if (done) moveTo(index);
									}}
									disabled={!done}
									aria-current={active ? "step" : undefined}
									className={cn(
										"flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-left transition-colors sm:px-3",
										active
											? "bg-[#02474F] text-white"
											: done
												? "bg-white/70 text-[#02474F]"
												: "bg-white/40 text-[#1A4349]/50",
									)}
								>
									<span
										className={cn(
											"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
											active
												? "bg-white text-[#02474F]"
												: done
													? "bg-[#02474F] text-white"
													: "bg-white text-[#1A4349]/40",
										)}
									>
										{done ? <Check className="h-3 w-3" /> : index}
									</span>
									<span className="hidden truncate text-xs font-semibold sm:block">
										{t(STEP_KEYS[index])}
									</span>
								</button>
							);
						})}
					</div>

					<div className="mt-4 flex flex-wrap gap-2 lg:hidden">
						<SummaryChip icon={Clock} label={t("summaryTime")} />
						<SummaryChip icon={Check} label={t("summaryFree")} />
						<SummaryChip icon={Check} label={t("summaryNoPayment")} />
					</div>

					<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
						{step === 1 && (
							<div className="flex flex-col gap-5">
								<SelectField
									id="class-audience"
									label={t("whoIsThisFor")}
									placeholder={t("whoIsThisFor")}
									value={form.audience}
									onChange={(event) => update("audience", event.target.value)}
									onBlur={() => markTouched("audience")}
									options={audienceOptions}
									requiredLabel={t("requiredLabel")}
									error={errors.audience ? t(errors.audience) : undefined}
								/>
								<CheckboxGroup
									label={t("goalLabel")}
									options={goalOptions}
									values={form.goals}
									onToggle={toggleGoal}
									onBlur={() => markTouched("goals")}
									requiredLabel={t("requiredLabel")}
									error={errors.goals ? t(errors.goals) : undefined}
								/>
							</div>
						)}

						{step === 2 && (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<SelectField
									id="class-level"
									label={t("urhoboLevelLabel")}
									placeholder={t("urhoboLevelLabel")}
									value={form.level}
									onChange={(event) => update("level", event.target.value)}
									onBlur={() => markTouched("level")}
									options={levelOptions}
									requiredLabel={t("requiredLabel")}
									error={errors.level ? t(errors.level) : undefined}
								/>
								<SelectField
									id="class-dialect"
									label={t("dialectLabel")}
									placeholder={t("dialectUnknown")}
									value={form.dialect}
									onChange={(event) => update("dialect", event.target.value)}
									onBlur={() => markTouched("dialect")}
									options={dialectOptions}
									requiredLabel={t("requiredLabel")}
									error={errors.dialect ? t(errors.dialect) : undefined}
								/>
								<SelectField
									id="class-practice"
									label={t("practiceTimeLabel")}
									placeholder={t("practiceTimeLabel")}
									value={form.practiceTime}
									onChange={(event) =>
										update("practiceTime", event.target.value)
									}
									onBlur={() => markTouched("practiceTime")}
									options={practiceOptions}
									requiredLabel={t("requiredLabel")}
									error={
										errors.practiceTime ? t(errors.practiceTime) : undefined
									}
								/>
							</div>
						)}

						{step === 3 && (
							<div className="flex flex-col gap-5">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<TextField
										id="class-full-name"
										label={t("fullNameLabel")}
										placeholder={t("fullNamePlaceholder")}
										value={form.fullName}
										onChange={(value) => update("fullName", value)}
										onBlur={() => markTouched("fullName")}
										requiredLabel={t("requiredLabel")}
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
										onBlur={() => markTouched("phone")}
										requiredLabel={t("requiredLabel")}
										error={errors.phone ? t(errors.phone) : undefined}
										autoComplete="tel"
									/>
									<TextField
										id="class-location"
										label={t("basedInLabel")}
										placeholder="Lagos, Nigeria"
										value={form.location}
										onChange={(value) => update("location", value)}
										onBlur={() => markTouched("location")}
										requiredLabel={t("requiredLabel")}
										error={errors.location ? t(errors.location) : undefined}
									/>
									<SelectField
										id="class-session"
										label={t("preferredSessionTime")}
										placeholder={t("preferredSessionTime")}
										value={form.sessionTime}
										onChange={(event) =>
											update("sessionTime", event.target.value)
										}
										onBlur={() => markTouched("sessionTime")}
										options={sessionOptions}
										requiredLabel={t("requiredLabel")}
										error={
											errors.sessionTime ? t(errors.sessionTime) : undefined
										}
									/>
									<SelectField
										id="class-package"
										label={t("packageInterest")}
										placeholder={t("packageNotSure")}
										value={effectivePackage}
										onChange={(event) =>
											update("packageInterest", event.target.value)
										}
										onBlur={() => markTouched("packageInterest")}
										options={packageOptions}
										requiredLabel={t("requiredLabel")}
										error={
											errors.packageInterest
												? t(errors.packageInterest)
												: undefined
										}
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
											onChange={(event) => {
												update("consent", event.target.checked);
												markTouched("consent");
											}}
											className="mt-0.5 h-4 w-4 accent-[#02474F]"
										/>
										<span>
											{t("consentContact")}{" "}
											<span className="font-normal text-[#1A4349]/50">
												({t("requiredLabel")})
											</span>
										</span>
									</label>
									{errors.consent && (
										<p className="text-xs font-medium text-red-600">
											{t(errors.consent)}
										</p>
									)}
								</div>
							</div>
						)}

						{step === 3 && !isSignedIn && (
							<div className="flex items-start gap-3 rounded-xl border border-[#02474F]/15 bg-[#FBF5EA] px-4 py-3">
								<Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#02474F]" />
								<p className="text-xs leading-relaxed text-[#1A4349]/75">
									{t("signInToSubmitClassApplication")}
								</p>
							</div>
						)}

						<div className="flex items-center justify-between gap-3 border-t border-[#02474F]/10 pt-5">
							<button
								type="button"
								onClick={goBack}
								disabled={step === 1}
								className="inline-flex items-center justify-center rounded-xl border-2 border-[#02474F]/15 bg-white px-5 py-3 text-sm font-bold text-[#02474F] transition-colors hover:border-[#41A3AD] disabled:cursor-not-allowed disabled:opacity-40"
							>
								{t("backStep")}
							</button>

							{step < 3 ? (
								<button
									type="button"
									onClick={goNext}
									disabled={!isStepValid}
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{t("nextStep")}
									<ArrowRight className="h-4 w-4" />
								</button>
							) : !isSignedIn ? (
								<Link
									href={signInHref}
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
								>
									<Lock className="h-4 w-4" />
									{t("signInToApplyClass")}
								</Link>
							) : (
								<button
									type="submit"
									disabled={!isFormValid}
									className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{t("submitClassApplication")}
								</button>
							)}
						</div>

						<p className="text-center text-[11px] text-[#1A4349]/50">
							{t("classFormFootnote")}
						</p>
					</form>
				</div>

				<aside className="hidden lg:sticky lg:top-32 lg:block">
					<div className="flex flex-col gap-5 rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-6">
						<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0E808D]">
							{t("summaryTitle")}
						</p>

						<div className="flex flex-col gap-1">
							<span className="text-xs text-[#1A4349]/55">
								{t("selectedPackageLabel")}
							</span>
							<span className="text-lg font-semibold text-[#02474F]">
								{packageLabel}
							</span>
							<Link
								href="#pricing"
								className="mt-1 text-[11px] font-semibold text-[#0E808D] hover:underline"
							>
								{t("selectedPackageNote")}
							</Link>
						</div>

						<div className="flex flex-col gap-2.5 border-t border-[#02474F]/10 pt-5">
							<span className="inline-flex items-center gap-2 text-xs font-semibold text-[#02474F]">
								<Clock className="h-3.5 w-3.5 text-[#0E808D]" />
								{t("summaryTime")}
							</span>
							<span className="inline-flex items-center gap-2 text-xs font-semibold text-[#02474F]">
								<Check className="h-3.5 w-3.5 text-[#0E808D]" />
								{t("summaryFree")}
							</span>
							<span className="inline-flex items-center gap-2 text-xs font-semibold text-[#02474F]">
								<Check className="h-3.5 w-3.5 text-[#0E808D]" />
								{t("summaryNoPayment")}
							</span>
						</div>

						<div className="border-t border-[#02474F]/10 pt-5">
							<p className="text-sm font-semibold text-[#02474F]">
								{t("questionsLabel")}
							</p>
							<Link
								href="#faq"
								className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#0E808D] hover:underline"
							>
								{t("faqHelpCta")}
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</div>
				</aside>
			</div>
		</ClassesSection>
	);
}

function SummaryChip({
	icon: Icon,
	label,
}: {
	icon: typeof Check;
	label: string;
}) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2FEFF] px-3 py-1.5 text-[11px] font-semibold text-[#02474F]">
			<Icon className="h-3 w-3 text-[#0E808D]" />
			{label}
		</span>
	);
}

function ApplicationSuccess({ reference }: { reference: string }) {
	const { t } = useTranslation("common");

	return (
		<ClassesSection id="apply" tone="tint">
			<div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] p-6 text-center sm:p-10">
				<span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#02474F] text-white">
					<CheckCircle2 className="h-7 w-7" />
				</span>
				<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
					{t("classSuccessTitle")}
				</h2>
				<p className="max-w-xl text-sm leading-relaxed text-[#1A4349]/80">
					{t("classSuccessDescription")}
				</p>

				<div className="flex flex-col items-center gap-1 rounded-2xl bg-[#FBF5EA] px-6 py-4">
					<span className="text-[11px] font-bold uppercase tracking-widest text-[#1A4349]/60">
						{t("classReferenceLabel")}
					</span>
					<span className="text-2xl font-bold tracking-wide text-[#0E808D]">
						{reference}
					</span>
				</div>

				<p className="text-xs text-[#1A4349]/60">{t("classSuccessNote")}</p>

				<div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-[#02474F]">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2FEFF] px-3 py-1.5">
						<Clock className="h-3.5 w-3.5" /> {t("classFormFootnote")}
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2FEFF] px-3 py-1.5">
						<MessageCircle className="h-3.5 w-3.5" /> WhatsApp
					</span>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2FEFF] px-3 py-1.5">
						<Mail className="h-3.5 w-3.5" /> email
					</span>
				</div>

				<Link
					href="#pricing"
					className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
				>
					{t("seeLevelsPricing")}
				</Link>
			</div>
		</ClassesSection>
	);
}
