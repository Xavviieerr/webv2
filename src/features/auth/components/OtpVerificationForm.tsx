import React from "react";
import { MdArrowBack } from "react-icons/md";
import { RiLoader2Fill } from "react-icons/ri";
import { useOtpInput } from "@/features/auth/hooks";

const TEAL = "#05353A";
const BORDER_GRAY = "#D1D5DB";

interface OtpVerificationFormProps {
  /** Header title */
  title: string;
  /** Subtitle / email prompt */
  subtitle: string;
  /** Called with the full 6-digit OTP on submit */
  onSubmit: (fullOtp: string) => void;
  /** Called when resend is clicked */
  onResend: () => void;
  /** Called when back button is clicked (hidden if undefined) */
  onBack?: () => void;
  /** Whether the submit button shows a spinner */
  isSubmitting: boolean;
  /** Error message displayed above the form */
  error?: string;
  /** Success message displayed above the form */
  success?: string;
  /** Label on the submit button */
  submitLabel?: string;
  /** Label on the resend link */
  resendLabel?: string;
  /** Hide the back button (default false) */
  hideBack?: boolean;
}

/**
 * Presentational OTP verification form.
 *
 * Owns the OTP input state (via useOtpInput) and renders the
 * 6-digit input grid, submit button, and resend link.
 *
 * Does NOT own API calls, navigation, or toasts — the parent
 * provides onSubmit and onResend callbacks.
 */
export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  title,
  subtitle,
  onSubmit,
  onResend,
  onBack,
  isSubmitting,
  error,
  success,
  submitLabel = "Verify",
  resendLabel = "Resend",
  hideBack = false,
}) => {
  const {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    getFullOtp,
  } = useOtpInput();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = getFullOtp();
    if (fullOtp.length === 6) {
      onSubmit(fullOtp);
    }
  };

  return (
    <div className="space-y-4">
      {!hideBack && onBack && (
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-[#05353A] hover:text-[#05353A]/80 transition-colors mr-3"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#05353A]">{title}</h2>
            <p className="text-sm text-[#05353A]/70">{subtitle}</p>
          </div>
        </div>
      )}

      {hideBack && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#05353A]">{title}</h2>
          <p className="text-sm text-[#05353A]/70">{subtitle}</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-sm text-center">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-[#05353A] text-lg rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#05353A]"
                style={{ borderColor: BORDER_GRAY }}
                inputMode="numeric"
                pattern="\d"
                required
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onResend}
            disabled={isSubmitting}
            className="text-[#05353A] text-sm hover:underline disabled:opacity-50"
          >
            {resendLabel}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || getFullOtp().length !== 6}
          className="bg-[#05353A] text-white py-3 px-6 w-full rounded-lg font-medium hover:bg-[#05353A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              Verifying
              <RiLoader2Fill className="animate-spin ml-2" />
            </span>
          ) : (
            <p>{submitLabel}</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
