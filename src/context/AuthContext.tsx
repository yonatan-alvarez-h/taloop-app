import React, { useMemo, useState } from "react";
import {
  clearAccessToken,
  getAccessToken,
  storeAccessToken,
} from "../services/authService";
import { AuthContext, type AuthContextValue } from "./contextValue";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login: (token: string) => {
        storeAccessToken(token);
        setAccessToken(token);
      },
      logout: () => {
        clearAccessToken();
        setAccessToken(null);
      },
    }),
    [accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
