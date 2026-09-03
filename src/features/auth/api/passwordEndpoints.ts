import { toast } from "react-hot-toast";
import { apiSlice } from "@/slice/requestSlice";
import { extractErrorMessage } from "@/features/auth/lib/errors";

export const passwordEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyUser: builder.mutation<unknown, { email: string }>({
      query: (body) => ({ url: "/auth/verify-user", method: "POST", body }),
    }),

    requestPasswordReset: builder.mutation<
      { message: string },
      { email: string; userId: string }
    >({
      query: (body) => ({
        url: "/auth/enhanced-reset",
        method: "POST",
        body: { email: body.email, userId: body.userId },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Reset email sent successfully");
        } catch (err: unknown) {
          toast.error(extractErrorMessage(err, "Failed to send reset email"));
        }
      },
    }),

    verifyResetOtp: builder.mutation<
      { message: string; resetToken?: string },
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/auth/verify-reset-otp",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "OTP verified successfully");
        } catch (err: unknown) {
          toast.error(extractErrorMessage(err, "OTP verification failed"));
        }
      },
    }),

    resetPassword: builder.mutation<
      { message: string },
      {
        email: string;
        resetToken: string | null;
        password: string;
        confirmPassword: string;
      }
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Password reset successfully");
        } catch (err: unknown) {
          toast.error(extractErrorMessage(err, "Password reset failed"));
        }
      },
    }),
  }),
});

export const {
  useVerifyUserMutation,
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} = passwordEndpoints;
