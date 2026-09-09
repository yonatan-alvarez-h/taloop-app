import { createContext } from "react";
import type { UserProfile } from "../types/user";

export interface AuthContextValue {
  accessToken: string | null;
  userId: string | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  login: (accessToken: string, userId: string, profile: UserProfile) => void;
  updateProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
