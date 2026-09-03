import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { RiLoader2Fill } from "react-icons/ri";
import { useRequestPasswordResetMutation } from "@/features/auth/api/passwordEndpoints";
import type { ForgotPasswordUser } from "@/features/auth/types";
import { useTranslation } from "react-i18next";
import { validateEmail } from "@/features/auth/schemas";
import { extractErrorMessage } from "@/features/auth/lib/errors";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { TEAL, BORDER_GRAY, TEXT_GRAY } from "@/features/auth/constants";

interface RequestResetStepProps {
	onNext: (id: string, email: string) => void;
	onClose: () => void;
	user: ForgotPasswordUser | null;
	onBack?: () => void;
}

const RequestResetStep: React.FC<RequestResetStepProps> = ({
	onNext,
	user,
	onBack,
}) => {
	const [email, setEmail] = useState(user?.email || "");
	const [error, setError] = useState("");
	const { t } = useTranslation("common");
	const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validationError = validateEmail(email);
		if (validationError) {
			setError(t(validationError));
			return;
		}

		setError("");

		try {
			await requestReset({
				email: email.trim(),
				userId: user?.id as string,
			}).unwrap();
			toast.success(
				t("resetEmailSentSuccessfully") || "Reset email sent successfully",
			);
			onNext(user?.id as string, email.trim());
		} catch (err: unknown) {
			const msg = extractErrorMessage(err) || t("failedToSendResetEmail") || "Failed to send reset email";
			setError(msg);
			toast.error(msg);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-center">
				<Lock className="w-12 h-12" style={{ color: TEXT_GRAY }} />
			</div>

			<div className="text-center">
				<h2 className="text-2xl sm:text-3xl text-sm font-bold text-black mb-2">
					{t("forgotPassword")}?
				</h2>
				<p
					className="text-sm sm:text-sm font-normal sm:text-center text-left"
					style={{ color: TEXT_GRAY }}
				>
					{t("forgotPasswordDescription") ||
						"No worries! Type in your email and we'll send you a reset link"}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<div className="relative">
						<Mail
							className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
							style={{ color: TEXT_GRAY }}
						/>
						<input
							id="reset-email"
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (error) setError("");
							}}
							className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white text-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#165e5b]/20 focus:ring-offset-0 transition"
							style={{ borderColor: BORDER_GRAY }}
							placeholder={t("enterYourEmail") || "Enter your email"}
							required
						/>
					</div>
					{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-3 rounded-lg text-white text-base font-bold hover:opacity-95 transition disabled:opacity-70 flex items-center justify-center gap-2"
					style={{ backgroundColor: TEAL }}
				>
					{isLoading ? (
						<>
							<RiLoader2Fill className="animate-spin w-5 h-5" />
							<span>{t("sending") || "Sending..."}</span>
						</>
					) : (
						t("sendLink") || "Send Link"
					)}
				</button>

				<div className="text-center text-sm text-black">
					{t("didntGetLink") || "Didn't get the link?"}{" "}
					<button
						type="button"
						onClick={handleSubmit}
						className="font-medium hover:underline"
						style={{ color: TEAL }}
					>
						{t("resend") || "Re-send"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RequestResetStep;
