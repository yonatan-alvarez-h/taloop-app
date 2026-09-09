import React, { useMemo, useState } from "react";
import {
  clearAccessToken,
  getAccessToken,
  getUserId,
  storeAccessToken,
  storeUserId,
} from "../services/authService";
import { AuthContext, type AuthContextValue } from "./contextValue";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken
  );
  const [userId, setUserId] = useState<string | null>(getUserId);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      userId,
      isAuthenticated: Boolean(accessToken && userId),
      login: (token: string, authenticatedUserId: string) => {
        storeAccessToken(token);
        storeUserId(authenticatedUserId);
        setAccessToken(token);
        setUserId(authenticatedUserId);
      },
      logout: () => {
        clearAccessToken();
        setAccessToken(null);
        setUserId(null);
      },
    }),
    [accessToken, userId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
