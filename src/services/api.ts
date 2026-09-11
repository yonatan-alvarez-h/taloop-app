import {
  AUTH_UNAUTHORIZED_EVENT,
  clearAccessToken,
  getAuthorizationHeaders,
} from "./authService";

export const API_BASE = import.meta.env.DEV
  ? "/api/v1"
  : "http://127.0.0.1:8000/api/v1";
const TRANSIENT_RETRY_DELAY_MS = 250;

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ApiErrorPayload {
  detail?: string | Array<{ loc?: Array<string | number>; msg?: string }>;
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

async function getErrorDetails(
  response: Response,
  fallback: string
): Promise<{ message: string; fieldErrors: Record<string, string> }> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;

    if (typeof payload.detail === "string") {
      return { message: payload.detail, fieldErrors: {} };
    }
    if (Array.isArray(payload.detail)) {
      const messages = payload.detail
        .map((error) => error.msg)
        .filter((message): message is string => Boolean(message));
      const fieldErrors: Record<string, string> = {};
      payload.detail.forEach((error) => {
        const field = error.loc?.at(-1);
        if (typeof field === "string" && error.msg) {
          fieldErrors[field] = error.msg;
        }
      });
      if (messages.length > 0) {
        return { message: messages.join(". "), fieldErrors };
      }
    }
    if (payload.message) return { message: payload.message, fieldErrors: {} };
  } catch {
    // Algunos errores del backend no incluyen un cuerpo JSON.
  }

  return { message: fallback, fieldErrors: {} };
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
    if (response.status === 401) {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }

    const errorDetails = await getErrorDetails(
      response,
      "No se pudo completar la operación"
    );
    throw new ApiError(errorDetails.message, response.status, errorDetails.fieldErrors);
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
