"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/types/hooks";
import { restoreAuth } from "@/features/auth/store/authSlice";
import { logoutHandler } from "@/features/auth/lib/logoutHandler";
import { session } from "@/features/auth/services/session";
import type { AuthUser } from "@/features/auth/types";
import { PROTECTED_ROUTES, HOME_ROUTES, AUTH_ROUTES } from "@/features/auth/constants";
import Loader from "@/components/Loader";

interface AuthGuardProps {
	children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const [bootstrapping, setBootstrapping] = useState(true);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { isAuthenticated, user } = useAppSelector((state) => state.auth);

	const isVerifyOtpPage =
		pathname === "/verify-otp" || pathname.startsWith("/verify-otp");
	const hasEmailParam = searchParams?.get("email");
	const isPostSignupVerification = isVerifyOtpPage && !!hasEmailParam;

	const requiresAuth = PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route),
	);
	const isAuthRoute = AUTH_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(route),
	);
	const isHomeRoute = HOME_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(route),
	);

	useEffect(() => {
		if (typeof window === "undefined") {
			setBootstrapping(false);
			return;
		}

		try {
			const { accessToken, refreshToken, stayLoggedIn } =
				session.loadTokens();
			const savedUser = session.loadUser();

			if (accessToken && refreshToken && savedUser) {
				try {
					const parsedUser = savedUser as unknown as AuthUser;
					dispatch(
						restoreAuth({
							token: accessToken,
							refreshToken,
							user: parsedUser,
							stayLoggedIn,
						}),
					);
				} catch {
					session.clearSession();
				}
			} else if (accessToken || refreshToken) {
				session.clearSession();
			}
		} catch {
			// Ignore bootstrap errors
		} finally {
			setBootstrapping(false);
		}
	}, [dispatch]);

	const handleLogout = () => {
		logoutHandler();
		router.replace("/home");
	};

	useEffect(() => {
		if (bootstrapping) return;

		if (
			isAuthenticated &&
			user &&
			isVerifyOtpPage &&
			!isPostSignupVerification
		) {
			router.replace("/search");
			return;
		}

		if (isAuthenticated && user && isHomeRoute) {
			router.replace("/search");
			return;
		}

		if (requiresAuth && !isAuthenticated) {
			const { refreshToken, stayLoggedIn } = session.loadTokens();
			const savedUser = session.loadUser();
			if (refreshToken && stayLoggedIn && savedUser) {
				return;
			}
			if (refreshToken && stayLoggedIn && !savedUser) {
				// Tokens exist but the user object was lost (e.g. storage partially
				// cleared). Rebuild the session or clear it instead of hanging.
				session.clearSession();
				handleLogout();
				return;
			}
			handleLogout();
		}
	}, [
		requiresAuth,
		bootstrapping,
		isAuthenticated,
		user,
		pathname,
		router,
		isHomeRoute,
		isVerifyOtpPage,
		isPostSignupVerification,
	]);

	if (bootstrapping) return <Loader />;
	if (isAuthRoute) return <>{children}</>;
	if (requiresAuth && !isAuthenticated) return <Loader />;
	if (requiresAuth && isAuthenticated && !user) return <Loader />;
	if (
		isAuthenticated &&
		user &&
		isVerifyOtpPage &&
		!isPostSignupVerification
	)
		return <Loader />;
	if (isAuthenticated && user && isHomeRoute) return <Loader />;

	return <>{children}</>;
};

export default AuthGuard;
