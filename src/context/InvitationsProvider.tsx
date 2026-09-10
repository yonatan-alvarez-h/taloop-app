import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMyOwnerInvitations } from "../services/ownersService";
import { useAuth } from "./useAuth";
import { InvitationsContext } from "./invitationsContext";
import type { OwnerInvitation } from "../types/owner";
import { ApiError } from "../services/api";

export const InvitationsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isAuthenticated, logout } = useAuth();
  const [invitations, setInvitations] = useState<OwnerInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshInvitations = useCallback(async () => {
    if (!isAuthenticated) {
      setInvitations([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const pending = await fetchMyOwnerInvitations();
      setInvitations(
        pending.filter(
          (invitation) =>
            invitation.status === "pending" &&
            new Date(invitation.expires_at).getTime() > Date.now()
        )
      );
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        logout();
        return;
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar las invitaciones"
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    void refreshInvitations();
  }, [refreshInvitations]);

  const value = useMemo(
    () => ({
      invitations,
      loading,
      error,
      refreshInvitations,
      removeInvitation: (invitationId: string) => {
        setInvitations((current) =>
          current.filter((invitation) => invitation.id !== invitationId)
        );
      },
    }),
    [error, invitations, loading, refreshInvitations]
  );

  return (
    <InvitationsContext.Provider value={value}>
      {children}
    </InvitationsContext.Provider>
  );
};
