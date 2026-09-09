export const ACCESS_TOKEN_KEY = "access_token";

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const storeAccessToken = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getAuthorizationHeaders = (): HeadersInit => {
  const accessToken = getAccessToken();

  return accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
};
