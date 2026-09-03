"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PhoneLayout from "@/components/layouts/PhoneLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { RiLoader2Fill } from "react-icons/ri";
import {
	useVerifyOtpMutation,
	useResendOtpMutation,
} from "@/features/auth/api/authApi";
import Logo from "@/components/ui/Logo";
import { useLanguageSync, useOtpInput } from "@/features/auth/hooks";
import { validateOtp } from "@/features/auth/schemas";
import { TEAL, BORDER_GRAY, TEXT_GRAY } from "@/features/auth/constants";
import { session } from "@/features/auth/services/session";

export default function VerifyOTP() {
	const [submissionStarted, setSubmissionStarted] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t, i18n } = useLanguageSync();
	const [verifyOtp] = useVerifyOtpMutation();
	const [resendOtp] = useResendOtpMutation();
	const { otp, inputRefs, handleChange, handleKeyDown, handlePaste, getFullOtp } = useOtpInput();

	const getEmail = () => {
		const emailParam = searchParams.get("email");
		if (emailParam) return emailParam;
		const stored = session.loadSignupContext();
		return stored.email ?? "";
	};

	const email = getEmail();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");

		const fullOtp = getFullOtp();
		const validationError = validateOtp(fullOtp, t);
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}

		setSubmissionStarted(true);
		try {
			await verifyOtp({ otp: fullOtp, email }).unwrap();
			setSuccessMessage(t("accountVerifiedSuccessfully"));
			setTimeout(() => router.replace("/signin"), 1500);
		} catch (err: unknown) {
			setErrorMessage(
				(err as { data?: { message?: string } })?.data?.message ||
					t("invalidOtpPleaseTryAgain"),
			);
		}
		setSubmissionStarted(false);
	};

	const handleResendOTP = async () => {
		setErrorMessage("");
		setSuccessMessage("");
		try {
			const result = await resendOtp({ email }).unwrap();
			setSuccessMessage(result?.message || t("otpResentSuccessfully"));
		} catch (err: unknown) {
			setErrorMessage(
				(err as { data?: { message?: string } })?.data?.message ||
					t("failedToResendOtp"),
			);
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
						onClick={() => {}}
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
							{t("verifyYourAccount")}
						</h1>
						<p
							className="text-sm sm:text-base font-normal"
							style={{ color: TEXT_GRAY }}
						>
							{t("enter6digitCodeSentToEmail")}
						</p>
					</div>

					{errorMessage && (
						<p className="text-red-500 mb-4 text-sm text-center">
							{errorMessage}
						</p>
					)}
					{successMessage && (
						<p className="text-green-500 mb-4 text-sm text-center">
							{successMessage}
						</p>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="flex justify-center gap-3 mb-6">
							{Array.from({ length: 6 }).map((_, index) => (
								<input
									key={index}
									ref={(el) => { inputRefs.current[index] = el; }}
									type="text"
									value={otp[index]}
									onChange={(e) => handleChange(index, e.target.value, () => setErrorMessage(""))}
									onKeyDown={(e) => handleKeyDown(index, e)}
									onPaste={(e) => handlePaste(e, () => setErrorMessage(""))}
									maxLength={1}
									className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
									style={{ borderColor: BORDER_GRAY }}
									aria-required="true"
									inputMode="numeric"
									pattern="\d"
									required
								/>
							))}
						</div>

						<div className="text-center text-sm text-black">
							{t("didntReceiveCode")}{" "}
							<button
								type="button"
								onClick={handleResendOTP}
								className="font-medium hover:underline"
								style={{ color: TEAL }}
							>
								{t("resendCode")}
							</button>
						</div>

						<button
							type="submit"
							disabled={submissionStarted}
							className="w-full py-3 rounded-lg text-white text-base font-bold hover:opacity-95 transition disabled:opacity-70 flex items-center justify-center gap-2"
							style={{ backgroundColor: TEAL }}
						>
							{submissionStarted ? (
								<>
									<RiLoader2Fill className="animate-spin w-5 h-5" />
									<span>{t("verifying")}</span>
								</>
							) : (
								t("verifyAccount")
							)}
						</button>

						<p className="text-center text-sm text-black mt-6">
							{t("backTo")}{" "}
							<Link
								href="/signin"
								className="font-medium hover:underline"
								style={{ color: TEAL }}
							>
								{t("signIn")}
							</Link>
						</p>
					</form>
				</div>
			</section>
		</main>
	);
}
