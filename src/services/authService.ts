export const ACCESS_TOKEN_KEY = "access_token";
export const USER_ID_KEY = "user_id";

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

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

export const getAuthorizationHeaders = (): HeadersInit => {
  const accessToken = getAccessToken();

  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
};
