import { apiFetch } from "./api";
import type { User } from "../types/User";

type LoginRequest = {
  username: string;
  password: string;
};

export async function login(data: LoginRequest): Promise<User> {
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

export async function fetchMe(): Promise<User> {
  const response = await apiFetch(`/api/auth/me`);

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}