// Auth feature public API
// Re-export commonly used auth types and actions for other features

export { logout, restoreAuth, setUser, setAuthData, updateSubmissionState } from "./store/authSlice";
export type { AuthUser } from "./store/authSlice";

export {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
} from "./api/authApi";

export {
  useVerifyUserMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from "./api/passwordEndpoints";

export {
  useGetProvincesQuery,
  useGetTownsByProvinceIdQuery,
} from "./api/provinceEndpoints";

export { session } from "./services/session";

export { logoutHandler } from "./lib/logoutHandler";

export { extractErrorMessage } from "./lib/errors";

export type {
  AuthUser as AuthUserType,
  AuthState,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordUser,
  Province,
  ProvincesResponse,
  Town,
  TownsResponse,
} from "./types";

export {
  TEAL,
  BORDER_GRAY,
  TEXT_GRAY,
  STORAGE_KEYS,
  GUONO_LOGGED_IN_COOKIE,
  SIGNUP_STEPS,
  PROTECTED_ROUTES,
  HOME_ROUTES,
  AUTH_ROUTES,
} from "./constants";

export {
  validateLoginIdentifier,
  validateLoginPassword,
  signupStep1Schema,
  signupStep2Schema,
  signupFullSchema,
  validateSignupStep,
  createOtpSchema,
  validateOtp,
  emailSchema,
  resetPasswordSchema,
  changePasswordSchema,
  validateEmail,
  validateResetPassword,
} from "./schemas";

export {
  useLanguageSync,
  useOtpInput,
  usePasswordVisibility,
  useLoginFlow,
  useSignupFlow,
  useOtpVerificationFlow,
  useForgotPasswordFlow,
  useLogout,
} from "./hooks";

export { normalizeEmail, normalizeIdentifier } from "./utils";

// Components used by other features
export { default as ForgotPasswordModal } from "./components/ForgotPasswordModal";
export { default as VerifyUserStep } from "./components/VerifyUser";
export { default as RequestResetStep } from "./components/RequestResetStep";
export { default as OTPVerificationStep } from "./components/OTPVerificationStep";
export { default as SetNewPasswordStep } from "./components/SetNewPasswordStep";
export { default as OtpVerificationForm } from "./components/OtpVerificationForm";
