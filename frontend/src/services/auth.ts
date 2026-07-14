import { apiFetch } from "./api";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  id: number;
  username: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await apiFetch(`/api/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
}

export async function fetchMe(): Promise<LoginResponse> {
  const response = await apiFetch(`/api/auth/me`);

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}