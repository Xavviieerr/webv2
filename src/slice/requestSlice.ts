import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { session } from "@/features/auth/services/session";

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: void | PromiseLike<void>) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as { auth: { token: string | null } }).auth
            ?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const authState = api.getState() as {
                    auth: { refreshToken: string | null };
                };
                const storedAuth = session.loadTokens();
                const refreshToken = storedAuth.refreshToken ?? authState.auth?.refreshToken;

                if (!refreshToken) {
                    processQueue(new Error("No refresh token available"));
                    const { logout } = await import("@/features/auth/store/authSlice");
                    session.clearSession();
                    api.dispatch(logout());
                    return result;
                }

                const refreshResult = await baseQuery(
                    { url: "/auth/refresh", method: "POST", body: { refreshToken } },
                    api,
                    extraOptions,
                );

                if (refreshResult.error) {
                    processQueue(refreshResult.error);
                    const { logout } = await import("@/features/auth/store/authSlice");
                    session.clearSession();
                    api.dispatch(logout());
                } else {
                    const refreshData = refreshResult.data as {
                        accessToken?: string;
                        refreshToken?: string;
                    } | undefined;
                    if (refreshData?.accessToken && refreshData?.refreshToken) {
                        const { setAuthData } = await import(
                            "@/features/auth/store/authSlice"
                        );
                        const currentState = api.getState() as {
                            auth: { stayLoggedIn: boolean };
                        };
                        const stayLoggedIn = storedAuth.stayLoggedIn ?? currentState.auth?.stayLoggedIn ?? false;
                        session.saveTokens(refreshData.accessToken, refreshData.refreshToken, stayLoggedIn);
                        api.dispatch(
                            setAuthData({
                                token: refreshData.accessToken,
                                refreshToken: refreshData.refreshToken,
                                stayLoggedIn,
                            }),
                        );
                    }
                    processQueue(null);
                    result = await baseQuery(args, api, extraOptions);
                }
            } catch (err) {
                processQueue(err);
                const { logout } = await import("@/features/auth/store/authSlice");
                session.clearSession();
                api.dispatch(logout());
            } finally {
                isRefreshing = false;
            }
        } else {
            try {
                await new Promise<void>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
                result = await baseQuery(args, api, extraOptions);
            } catch (err) {
                const { logout } = await import("@/features/auth/store/authSlice");
                session.clearSession();
                api.dispatch(logout());
                result = { error: { status: 401, data: err } } as {
                    error: FetchBaseQueryError;
                };
            }
        }
    }

    return result;
};

type ValidTags = "User" | "Word" | "Auth" | "Dictionary" | "Notification" | "SupportTicket" | "CommunityPost" | "CommunityComment" | "CommunityReply" | "Place" | "Contributor" | "Folktale";

type MutationArg<TBody = unknown> = {
    url: string;
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: TBody;
    invalidatesTags?: { type: ValidTags; id?: string | number }[];
};

type GenericResponse<T> = {
    message: string;
    data: T;
};

export interface ErrorResponse {
    message: string;
    status: number;
    error: Record<string, string[]>;
}

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Word", "Auth", "Dictionary", "Notification", "SupportTicket", "CommunityPost", "CommunityComment", "CommunityReply", "Place", "Contributor", "Folktale"],
    endpoints: (builder) => ({
        getUser: builder.query<GenericResponse<unknown>, MutationArg>({
            query: (args) => ({
                url: args.url,
                method: args.method,
                body: args.body,
            }),
        }),
    }),
});
