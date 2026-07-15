const API_URL = import.meta.env.VITE_API_URL
  ? "https://co-wordbook.onrender.com"
  : "";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function apiFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(`${API_URL}${input}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (response.status === 401) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response;
}