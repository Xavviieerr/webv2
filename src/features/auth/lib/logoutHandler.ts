import { session } from "@/features/auth/services/session";
import { store } from "@/store/store";
import { logout } from "@/features/auth/store/authSlice";
import { languageStore } from "@/slice/changeLangSlice";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "";

export function logoutHandler(): void {
	const { accessToken } = session.loadTokens();

	session.clearSession();
	languageStore.remove();
	store.dispatch(logout());

	fetch(`${BASE_URL}/auth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		},
	}).catch(() => {});
}
