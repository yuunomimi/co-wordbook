import type { Word } from "../types/Word";
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchWordsByWordbookId(wordbookId: number): Promise<Word[]> {
  const response = await fetch(`${API_URL}/api/wordbooks/${wordbookId}/words`);
  if (!response.ok) {
    throw new Error(`Failed to fetch words for wordbook ${wordbookId}`);
  }
  return response.json();
}