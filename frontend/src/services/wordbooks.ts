import type { Wordbook } from "../types/Wordbook";
const API_URL = import.meta.env.VITE_API_URL;

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

export async function fetchWordbooks(): Promise<Wordbook[]> {
  const response = await fetch(`${API_URL}/api/wordbooks`);
  if (!response.ok) {
    throw new Error("Failed to fetch wordbooks");
  }
  const data: WordbookResponse[] = await response.json();

  return data.map((wordbook) => ({
    ...wordbook,
    isMine: wordbook.ownerId == 1, // Replace 1 with the actual user ID
  }));
}

export async function fetchWordbookById(id: number): Promise<Wordbook | null> {
  const response = await fetch(`${API_URL}/api/wordbooks/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch wordbook with id ${id}`);
  }
  const wordbook: WordbookResponse | undefined = await response.json();
  if (!wordbook) {
    throw new Error(`Wordbook with id ${id} not found`);
  }
  return {
    ...wordbook,
    isMine: wordbook.ownerId == 1, // Replace 1 with the actual user ID
  };
}