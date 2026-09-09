import { createContext } from "react";

export interface AuthContextValue {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
