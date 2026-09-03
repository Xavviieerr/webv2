import { toast } from "react-hot-toast";
import isEmail from "@/features/auth/lib/isEmail";
import { apiSlice } from "@/slice/requestSlice";
import {
	setAuthData,
	setUser,
	logout,
	updateSubmissionState,
} from "@/features/auth/store/authSlice";
import { session } from "@/features/auth/services/session";
import { languageStore } from "@/slice/changeLangSlice";
import i18n from "@/lib/i18n";
import { extractErrorMessage } from "@/features/auth/lib/errors";
import type {
	LoginRequest,
	LoginResponse,
	AuthUser,
	RegisterRequest,
} from "@/features/auth/types";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<LoginResponse, LoginRequest>({
			query: (body) => ({
				url: "/auth/login",
				method: "POST",
				body: {
					userName: !isEmail(body.identifier) ? body.identifier : " ",
					email: isEmail(body.identifier) ? body.identifier : " ",
					password: body.password,
				},
			}),
			invalidatesTags: ["Auth", "User"],
			async onQueryStarted({ stayLoggedIn }, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					session.saveTokens(data.accessToken, data.refreshToken, !!stayLoggedIn);
					dispatch(
						setAuthData({
							token: data.accessToken,
							refreshToken: data.refreshToken,
							stayLoggedIn: !!stayLoggedIn,
						}),
					);
					dispatch(setUser(data.user));
					session.saveUser(data.user as AuthUser);
					dispatch(updateSubmissionState(false));
					toast.success(i18n.t("loginSuccessful", { ns: "common" }));
				} catch (err: unknown) {
					const errorMsg =
						extractErrorMessage(err) || i18n.t("loginFailed", { ns: "common" });
					toast.error(errorMsg);
					dispatch(updateSubmissionState(false));
				}
			},
		}),

		register: builder.mutation<{ message: string }, RegisterRequest>({
			query: (body) => ({ url: "/auth/register", method: "POST", body }),
			invalidatesTags: ["Auth"],
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					toast.success(data.message || "Verification email sent");
				} catch (err: unknown) {
					toast.error(extractErrorMessage(err, "Registration failed"));
				}
			},
		}),

		verifyOtp: builder.mutation<
			{ message: string },
			{ otp: string; email: string }
		>({
			query: (body) => ({ url: "/auth/verify-otp", method: "POST", body }),
			invalidatesTags: ["Auth"],
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					toast.success(data.message || "Account verified successfully");
				} catch (err: unknown) {
					toast.error(extractErrorMessage(err, "OTP verification failed"));
				}
			},
		}),

		resendOtp: builder.mutation<{ message: string }, { email: string }>({
			query: (body) => ({ url: "/auth/resend-otp", method: "POST", body }),
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					toast.success(data.message || "OTP resent successfully");
				} catch (err: unknown) {
					toast.error(extractErrorMessage(err, "Failed to resend OTP"));
				}
			},
		}),

		getMe: builder.query<AuthUser, void>({
			query: () => ({ url: "/users/me/profile" }),
			transformResponse: (response: AuthUser | { data: AuthUser }) =>
				"data" in response && response.data
					? response.data
					: (response as AuthUser),
			providesTags: ["User"],
			async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;

					const existingSession = session.loadUser();
					const existingRedux = (getState() as unknown as { auth: { user: AuthUser | null } }).auth.user;
					const base = existingRedux ?? existingSession;
					const merged = base ? { ...base, ...data } : data;
					dispatch(setUser(merged as unknown as AuthUser));
					session.saveUser(merged as AuthUser);
				} catch {
					// 401 handled by baseQuery
				}
			},
		}),

		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch {
					// Clear local state even if API fails
				} finally {
					session.clearSession();
					languageStore.remove();
					dispatch(logout());
				}
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useVerifyOtpMutation,
	useResendOtpMutation,
	useGetMeQuery,
	useLazyGetMeQuery,
	useLogoutMutation,
} = authApiSlice;
