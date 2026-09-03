"use client";

import { useCallback, useState } from "react";
import { useAppSelector } from "@/types/hooks";

/**
 * Auth gating for search actions: when the user is not authenticated, opens
 * the shared ComingSoon modal (preserving the prior dictionary behavior).
 * Exposes a single `ensureUser()` guard plus manual open/close for the modal.
 */
export function useComingSoonGate() {
  const user = useAppSelector((state) => state.auth.user);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const ensureUser = useCallback(() => {
    if (!user) {
      setShowComingSoonModal(true);
      return false;
    }
    return true;
  }, [user]);

  const openComingSoon = useCallback(() => {
    setShowComingSoonModal(true);
  }, []);

  const closeComingSoon = useCallback(() => {
    setShowComingSoonModal(false);
  }, []);

  return {
    showComingSoonModal,
    ensureUser,
    openComingSoon,
    closeComingSoon,
  };
}