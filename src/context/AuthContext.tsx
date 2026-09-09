import React, { useMemo, useState } from "react";
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

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken
  );
  const [userId, setUserId] = useState<string | null>(getUserId);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    getStoredUserProfile
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      userId,
      userProfile,
      isAuthenticated: Boolean(accessToken && userId),
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
