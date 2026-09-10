import type { UserProfile } from "../types/user";

export const ACCESS_TOKEN_KEY = "access_token";
export const USER_ID_KEY = "user_id";
export const USER_PROFILE_KEY = "user_profile";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const storeAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
};

export const storeUserId = (userId: string): void => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getStoredUserProfile = (): UserProfile | null => {
  if (typeof window === "undefined") return null;

  const storedProfile = localStorage.getItem(USER_PROFILE_KEY);
  if (!storedProfile) return null;

  try {
    return JSON.parse(storedProfile) as UserProfile;
  } catch {
    localStorage.removeItem(USER_PROFILE_KEY);
    return null;
  }
};

export const storeUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
};

export const getAuthorizationHeaders = (
  accessToken: string | null = getAccessToken()
): HeadersInit => {

  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
};
