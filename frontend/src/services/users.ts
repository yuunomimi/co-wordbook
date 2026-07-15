import { apiFetch } from "./api";
import type { User } from "../types/User";

export async function fetchUsersByWordbookId(wordbookId: number): Promise<User[]> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/users`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users for wordbook ${wordbookId}`);
  }

  return response.json();
}

export async function addUserToWordbook(wordbookId: number, username: string): Promise<void> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/users`, {
    method: "POST",
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add user ${username} to wordbook ${wordbookId}`);
  }
}

export async function removeUserFromWordbook(wordbookId: number, userId: number): Promise<void> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/users/${userId}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error(`Failed to remove user ${userId} from wordbook ${wordbookId}`);
  }
}