import type { UserProfile, UserRegistrationData } from "../types/user";
import { getAuthorizationHeaders } from "./authService";

const API_BASE = "http://127.0.0.1:8000/api/v1";

interface ApiErrorResponse {
  detail?: string | Array<{ msg?: string }>;
  message?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  user_id: string;
}

function getUserRequestHeaders(accessToken?: string | null): Headers {
  const headers = new Headers({
    accept: "application/json",
    ...getAuthorizationHeaders(),
  });

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function getApiErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorResponse;

    if (typeof payload.detail === "string") return payload.detail;
    if (Array.isArray(payload.detail)) {
      const messages = payload.detail
        .map((error) => error.msg)
        .filter((message): message is string => Boolean(message));
      if (messages.length > 0) return messages.join(". ");
    }
    if (payload.message) return payload.message;
  } catch {
    // El backend puede responder con un cuerpo vacío o no JSON.
  }

  return fallback;
}

export async function createUser(
  data: UserRegistrationData
): Promise<unknown> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "No se pudo crear el usuario")
    );
  }

  return response.json();
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que la API esté encendida."
    );
  }

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "Correo o contraseña incorrectos")
    );
  }

  const payload = (await response.json()) as Partial<LoginResponse>;

  if (!payload.access_token) {
    throw new Error("La respuesta de inicio de sesión no contiene un token.");
  }

  if (!payload.user_id) {
    throw new Error(
      "La respuesta de inicio de sesión no contiene el identificador del usuario."
    );
  }

  return payload as LoginResponse;
}

export async function changeUserPassword(
  userId: string,
  data: ChangePasswordData,
  accessToken?: string | null
): Promise<{ message: string }> {
  const headers = new Headers({
    accept: "application/json",
    "content-type": "application/json",
    ...getAuthorizationHeaders(),
  });

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(
    `${API_BASE}/users/${encodeURIComponent(userId)}/change-password`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "No se pudo actualizar la contraseña"
      )
    );
  }

  return response.json() as Promise<{ message: string }>;
}

export async function getUserProfile(
  userId: string,
  accessToken?: string | null
): Promise<UserProfile> {
  const response = await fetch(
    `${API_BASE}/users/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: getUserRequestHeaders(accessToken),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "No se pudieron cargar tus datos")
    );
  }

  return response.json() as Promise<UserProfile>;
}

export async function updateUserProfile(
  userId: string,
  data: UserProfile,
  accessToken?: string | null
): Promise<void> {
  const headers = getUserRequestHeaders(accessToken);
  headers.set("content-type", "application/json");

  const response = await fetch(
    `${API_BASE}/users/${encodeURIComponent(userId)}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, "No se pudieron actualizar tus datos")
    );
  }
}
