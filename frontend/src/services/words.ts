import type { Word } from "../types/Word";
import { apiFetch } from "./api";

export async function fetchWordsByWordbookId(wordbookId: number): Promise<Word[]> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/words`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch words for wordbook ${wordbookId}`);
  }

  return response.json();
}

export async function addWord(wordbookId: number, newWord: { word: string; meaning: string }): Promise<Word> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/words`, {
    method: "POST",
    body: JSON.stringify(newWord),
  });

  if (!response.ok) {
    throw new Error(`Failed to add word to wordbook ${wordbookId}`);
  }

  return response.json();
}

export async function updateWord(wordbookId: number, wordId: number, updatedWord: { word: string; meaning: string }): Promise<Word> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/words/${wordId}`, {
    method: "PATCH",
    body: JSON.stringify(updatedWord),
  });

  if (!response.ok) {
    throw new Error(`Failed to update word ${wordId} in wordbook ${wordbookId}`);
  }

  return response.json();
}

export async function deleteWord(wordbookId: number, wordId: number): Promise<void> {
  const response = await apiFetch(`/api/wordbooks/${wordbookId}/words/${wordId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete word ${wordId} from wordbook ${wordbookId}`);
  }
}