"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/types/hooks";
import { useLoginMutation } from "@/features/auth/api/authApi";
import { RiLoader2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import PhoneLayout from "@/components/layouts/PhoneLayout";
import Logo from "@/components/ui/Logo";
import { Mail, Lock } from "lucide-react";
import { useLanguageSync, usePasswordVisibility } from "@/features/auth/hooks";
import { validateLoginIdentifier, validateLoginPassword } from "@/features/auth/schemas";
import { TEAL, BORDER_GRAY, TEXT_GRAY } from "@/features/auth/constants";

export default function SignIn() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [login] = useLoginMutation();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const { visible: showPassword, toggle: togglePassword } = usePasswordVisibility();
	const [identifierError, setIdentifierError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const { t } = useTranslation("common");
	const [stayLoggedIn, setStayLoggedIn] = useState(false);
	const { toggleLanguage, i18n } = useLanguageSync();

	const validate = (): boolean => {
		let valid = true;
		setIdentifierError("");
		setPasswordError("");

		const idErr = validateLoginIdentifier(identifier);
		if (idErr) {
			setIdentifierError(idErr);
			valid = false;
		}

		const pwErr = validateLoginPassword(password);
		if (pwErr) {
			setPasswordError(pwErr);
			valid = false;
		}

		return valid;
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validate()) return;

		setSubmitting(true);

		try {
			await login({ identifier, password, stayLoggedIn }).unwrap();
			router.replace("/search");
		} catch {
			// Error toast shown by onQueryStarted in authApi
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 min-h-screen h-screen overflow-hidden">
			<aside className="min-h-0 overflow-hidden">
				<PhoneLayout />
			</aside>

			<section className="flex flex-col items-center justify-center bg-white py-8 px-4 sm:px-6 w-full min-h-0 overflow-y-auto">
				<div className="relative w-full max-w-[634px]">
					<button
						type="button"
						onClick={toggleLanguage}
						className="absolute top-0 right-0 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors z-10"
						style={{ color: TEAL }}
					>
						{i18n.language === "en" ? "URH" : "ENG"}
					</button>

					<div className="mb-8">
						<div className="mb-6">
							<Logo type="normal" />
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
							{t("welcomeBack")}
						</h1>
						<p
							className="text-sm sm:text-base font-normal"
							style={{ color: TEXT_GRAY }}
						>
							{t("loginDescription")}
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
						<div>
							<div className="relative">
								<Mail
									className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
									style={{ color: TEXT_GRAY }}
								/>
								<input
									id="identifier"
									type="text"
									placeholder={t("enterYourEmail")}
									value={identifier}
									onChange={(e) => {
										setIdentifier(e.target.value);
										if (identifierError) setIdentifierError("");
									}}
									className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition ${identifierError ? "border-red-500" : ""}`}
									style={!identifierError ? { borderColor: BORDER_GRAY } : undefined}
								/>
							</div>
							{identifierError && (
								<p className="text-red-500 text-xs mt-1">{t(identifierError)}</p>
							)}
						</div>

						<div>
							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
									style={{ color: TEXT_GRAY }}
								/>
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder={t("enterYourPassword")}
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										if (passwordError) setPasswordError("");
									}}
									className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition ${passwordError ? "border-red-500" : ""}`}
									style={!passwordError ? { borderColor: BORDER_GRAY } : undefined}
								/>
								<button
									type="button"
									onClick={togglePassword}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
									aria-label={showPassword ? t("hidePassword") : t("showPassword")}
								>
									{showPassword ? (
										<IoMdEyeOff size={20} />
									) : (
										<IoMdEye size={20} />
									)}
								</button>
							</div>
							{passwordError && (
								<p className="text-red-500 text-xs mt-1">{t(passwordError)}</p>
							)}
						</div>

						<div className="flex items-center justify-between gap-4">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={stayLoggedIn}
									onChange={() => setStayLoggedIn(!stayLoggedIn)}
									className="w-4 h-4 rounded border-gray-300 text-current focus:ring-2 focus:ring-offset-0"
									style={{ accentColor: TEAL }}
								/>
								<span className="text-sm font-normal text-black">
									{t("keepMeLogged")}
								</span>
							</label>
							<Link
								href="/forgot-password"
								className="text-sm font-medium hover:underline"
								style={{ color: TEAL }}
							>
								{t("forgotPassword")}?
							</Link>
						</div>

					<button
						type="submit"
						disabled={submitting}
						className="w-full py-3 rounded-lg text-white text-base font-bold hover:opacity-95 transition disabled:opacity-70 flex items-center justify-center gap-2"
						style={{ backgroundColor: TEAL }}
					>
						{submitting ? (
								<>
									<RiLoader2Fill className="animate-spin w-5 h-5" />
									<span>{t("submitting")}</span>
								</>
							) : (
								t("login")
							)}
						</button>

						<p className="text-center text-sm text-black mt-6">
							{t("dontHaveAccount?")}{" "}
							<Link
								href="/signup"
								className="font-medium hover:underline"
								style={{ color: TEAL }}
							>
								{t("signUp")}
							</Link>
						</p>
					</form>
				</div>
			</section>
		</main>
	);
}
