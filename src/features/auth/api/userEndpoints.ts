import { toast } from "react-hot-toast";
import { apiSlice } from "@/slice/requestSlice";
import { setUser } from "@/features/auth/store/authSlice";
import { session } from "@/features/auth/services/session";
import type { RootState } from "@/store/store";
import type { AuthUser } from "@/features/auth/types";

type UserByIdResponse = AuthUser & { password?: string };

export interface ActiveSession {
	id: string;
	userAgent: string;
	ipAddress: string;
	lastActivity: string;
}

export interface ImageUploadResponse {
	thumbnail: string;
	small: string;
	medium: string;
	large: string;
	original: string;
}

export interface UpdateProfileRequest {
	firstName?: string;
	lastName?: string;
	gender?: string;
	profilePictureUrl?: string;
	DOB?: string;
	province?: string;
	town?: string;
}

export const userEndpoints = apiSlice.injectEndpoints({
	overrideExisting: true,
	endpoints: (builder) => ({
		getUserById: builder.query<AuthUser, string>({
			query: (id) => ({ url: `/users/${id}` }),
			transformResponse: (response: UserByIdResponse) => {
				const { password: _p, ...rest } = response;
				return rest as AuthUser;
			},
			providesTags: (_result, _err, id) => [{ type: "User", id }],
		}),

		deleteUser: builder.mutation<void, string>({
			query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
			invalidatesTags: ["User", "Auth"],
		}),

		updateProfileImage: builder.mutation<
			ImageUploadResponse,
			{ imageFile: File; preferredFormat?: string; quality?: number }
		>({
			query: (body) => {
				const formData = new FormData();
				formData.append("imageFile", body.imageFile);
				formData.append("preferredFormat", body.preferredFormat ?? "webp");
				formData.append("quality", String(body.quality ?? 80));
				return {
					url: "/users/image/upload",
					method: "POST",
					body: formData,
				};
			},
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} catch (err: unknown) {
					const msg =
						(err as { data?: { message?: string } })?.data?.message ||
						"Failed to update profile picture";
					toast.error(msg);
				}
			},
		}),

		updateName: builder.mutation<
			AuthUser,
			{ firstName: string; lastName: string }
		>({
			query: (body) => ({
				url: "/users/me/name",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["User"],
			async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const existing = (getState() as RootState).auth.user;
					const merged = existing ? { ...existing, ...data } : data;
					dispatch(setUser(merged));
					session.saveUser(merged as AuthUser);
				} catch (err: unknown) {
					const msg =
						(err as { data?: { message?: string } })?.data?.message ||
						"Update failed";
					toast.error(msg);
				}
			},
		}),

		changePassword: builder.mutation<
			{ message: string },
			{
				currentPassword: string;
				newPassword: string;
				confirmNewPassword: string;
			}
		>({
			query: (body) => ({
				url: "/auth/change-password",
				method: "POST",
				body,
			}),
		}),

		updateUserName: builder.mutation<AuthUser, { username: string }>({
			query: (body) => ({
				url: "/users/me/username",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["User"],
			async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const existing = (getState() as RootState).auth.user;
					const merged = existing ? { ...existing, ...data } : data;
					dispatch(setUser(merged));
					session.saveUser(merged as AuthUser);
				} catch (err: unknown) {
					const msg =
						(err as { data?: { message?: string } })?.data?.message ||
						"Update failed";
					toast.error(msg);
				}
			},
		}),

		updateProfile: builder.mutation<AuthUser, UpdateProfileRequest>({
			query: (body) => ({
				url: "/users/me",
				method: "PATCH",
				body,
			}),
			transformResponse: (response: { data: AuthUser; message: string }) =>
				response.data,
			invalidatesTags: ["User"],
			async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					const existing = (getState() as RootState).auth.user;
					const merged = existing ? { ...existing, ...data } : data;
					dispatch(setUser(merged));
					session.saveUser(merged as AuthUser);
				} catch (err: unknown) {
					const msg =
						(err as { data?: { message?: string } })?.data?.message ||
						"Update failed";
					toast.error(msg);
				}
			},
		}),

    changeEmail: builder.mutation<
      { message: string },
      { newEmail: string; currentPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-email",
        method: "POST",
        body,
      }),
    }),

		verifyChangeEmail: builder.mutation<
			{ message: string },
			{ newEmail: string; code: string }
		>({
			query: (body) => ({
				url: "/auth/change-email/verify",
				method: "POST",
				body,
			}),
		}),

		getSessions: builder.query<ActiveSession[], void>({
			query: () => ({ url: "/auth/sessions" }),
			transformResponse: (response: unknown) => {
				if (Array.isArray(response)) return response as ActiveSession[];
				if (response && typeof response === "object" && "data" in response) {
					const d = (response as { data: unknown }).data;
					if (Array.isArray(d)) return d as ActiveSession[];
					if (d && typeof d === "object" && "sessions" in d) {
						return (d as { sessions: ActiveSession[] }).sessions;
					}
				}
				return [] as ActiveSession[];
			},
		}),

		logoutSession: builder.mutation<void, string>({
			query: (sessionId) => ({
				url: `/auth/${sessionId}/logout`,
				method: "POST",
			}),
		}),

		logoutAllSessions: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/sessions/logout-all",
				method: "POST",
			}),
		}),
	}),
});

export const {
	useGetUserByIdQuery,
	useLazyGetUserByIdQuery,
	useDeleteUserMutation,
	useUpdateProfileImageMutation,
	useUpdateNameMutation,
	useUpdateUserNameMutation,
	useUpdateProfileMutation,
	useChangePasswordMutation,
	useChangeEmailMutation,
	useVerifyChangeEmailMutation,
	useGetSessionsQuery,
	useLogoutSessionMutation,
	useLogoutAllSessionsMutation,
} = userEndpoints;
