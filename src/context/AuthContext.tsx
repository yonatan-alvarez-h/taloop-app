import React, { useEffect, useMemo, useState } from "react";
import {
  clearAccessToken,
  getAccessToken,
  getStoredUserProfile,
  getUserId,
  storeAccessToken,
  storeUserProfile,
  storeUserId,
} from "../services/authService";
import { AuthContext, type AuthContextValue } from "./contextValue";
import type { UserProfile } from "../types/user";
import { getCurrentUser } from "../services/usersService";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken
  );
  const [userId, setUserId] = useState<string | null>(getUserId);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    getStoredUserProfile
  );

  useEffect(() => {
    if (!accessToken) return;

    let active = true;
    getCurrentUser(accessToken)
      .then((profile) => {
        if (active) {
          if (
            (profile.status && profile.status !== "active") ||
            profile.is_active === false
          ) {
            clearAccessToken();
            setAccessToken(null);
            setUserId(null);
            setUserProfile(null);
            return;
          }
          storeUserProfile(profile);
          setUserProfile(profile);
          if (profile.id && profile.id !== userId) {
            storeUserId(profile.id);
            setUserId(profile.id);
          }
        }
      })
      .catch(() => {
        // La pantalla conserva la sesión local y cada operación validará el token.
      });

    return () => {
      active = false;
    };
  }, [accessToken, userId]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      userId,
      userProfile,
      isAuthenticated: Boolean(
        accessToken &&
          userId &&
          userProfile?.status !== "suspended" &&
          userProfile?.status !== "deactivated" &&
          userProfile?.is_active !== false
      ),
      login: (
        token: string,
        authenticatedUserId: string,
        profile: UserProfile
      ) => {
        storeAccessToken(token);
        storeUserId(authenticatedUserId);
        storeUserProfile(profile);
        setAccessToken(token);
        setUserId(authenticatedUserId);
        setUserProfile(profile);
      },
      updateProfile: (profile: UserProfile) => {
        storeUserProfile(profile);
        setUserProfile(profile);
      },
      logout: () => {
        clearAccessToken();
        setAccessToken(null);
        setUserId(null);
        setUserProfile(null);
      },
    }),
    [accessToken, userId, userProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
