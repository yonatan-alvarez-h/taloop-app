import { getAuthorizationHeaders } from "./authService";

export const API_BASE = import.meta.env.DEV
  ? "/api/v1"
  : "http://127.0.0.1:8000/api/v1";
const TRANSIENT_RETRY_DELAY_MS = 250;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiErrorPayload {
  detail?: string | Array<{ msg?: string }>;
  message?: string;
}

const waitForTransientRetry = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, TRANSIENT_RETRY_DELAY_MS);
  });

async function fetchWithTransientReadRetry(
  path: string,
  init: RequestInit,
  headers: Headers
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const attempts = method === "GET" || method === "HEAD" ? 3 : 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(`${API_BASE}${path}`, { ...init, headers });
    } catch (error) {
      if (attempt === attempts) throw error;
      await waitForTransientRetry();
    }
  }

  throw new Error("No se pudo iniciar la solicitud");
}

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;

    if (typeof payload.detail === "string") return payload.detail;
    if (Array.isArray(payload.detail)) {
      const messages = payload.detail
        .map((error) => error.msg)
        .filter((message): message is string => Boolean(message));
      if (messages.length > 0) return messages.join(". ");
    }
    if (payload.message) return payload.message;
  } catch {
    // Algunos errores del backend no incluyen un cuerpo JSON.
  }

  return fallback;
}

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
  options: { accessToken?: string | null; authenticated?: boolean } = {}
): Promise<T> {
  const headers = new Headers({
    accept: "application/json",
    ...(options.authenticated === false
      ? {}
      : getAuthorizationHeaders(options.accessToken)),
    ...init.headers,
  });

  let response: Response;
  try {
    response = await fetchWithTransientReadRetry(path, init, headers);
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Intenta de nuevo.",
      0
    );
  }

  if (!response.ok) {
    throw new ApiError(
      await getErrorMessage(response, "No se pudo completar la operación"),
      response.status
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function requestNoContent(
  path: string,
  init: RequestInit = {},
  options: { accessToken?: string | null; authenticated?: boolean } = {}
): Promise<void> {
  await requestJson<undefined>(path, init, options);
}
