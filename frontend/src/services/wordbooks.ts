import type { Wordbook } from "../types/Wordbook";
import { apiFetch } from "./api";

type WordbookResponse = {
  id: number;
  title: string;
  description: string;
  themeColor: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
};

export async function fetchWordbooks(): Promise<WordbookResponse[]> {
  const response = await apiFetch(`/api/wordbooks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wordbooks`);
  }
  const data: WordbookResponse[] = await response.json();

  return data;
}

export async function fetchWordbookById(id: number): Promise<WordbookResponse | null> {
  const response = await apiFetch(`/api/wordbooks/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wordbook with id ${id}`);
  }

  const wordbook: WordbookResponse | undefined = await response.json();

  if (!wordbook) {
    throw new Error(`Wordbook with id ${id} not found`);
  }

  return wordbook;
}