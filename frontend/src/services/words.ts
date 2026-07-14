import type { Word } from "../types/Word";
import { apiFetch } from "./api";

export async function fetchWordsByWordbookId(wordbookId: number): Promise<Word[]> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/words`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch words for wordbook ${wordbookId}`);
  }

  return response.json();
}