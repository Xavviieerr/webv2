import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { logoutHandler } from "@/features/auth/lib/logoutHandler";

/**
 * Encapsulates the full logout flow:
 * 1. Fire-and-forget POST /auth/logout
 * 2. Clear local session + state
 * 3. Redirect to /home
 */
export function useLogout() {
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();

  const logout = useCallback(async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Proceed with local logout even if API fails
    } finally {
      logoutHandler();
      router.replace("/home");
    }
  }, [logoutApi, router]);

  return { logout };
}
