import type { UserRegistrationData } from "../types/user";

const API_BASE = "http://127.0.0.1:8000/api/v1";

interface ApiErrorResponse {
  detail?: string | Array<{ msg?: string }>;
  message?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
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

export async function changeUserPassword(
  userId: string,
  data: ChangePasswordData,
  accessToken?: string | null
): Promise<{ message: string }> {
  const headers: HeadersInit = {
    accept: "application/json",
    "content-type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
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
