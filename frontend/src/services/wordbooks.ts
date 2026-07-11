import type { Wordbook } from "../types/Wordbook";

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
  const response = await fetch("/mockapi/wordbooks.json");
  if (!response.ok) {
    throw new Error("Failed to fetch wordbooks");
  }
  const data: WordbookResponse[] = await response.json();
  
  return data.map((wordbook) => ({
    ...wordbook,
    isMine: wordbook.ownerId == 1, // Replace 1 with the actual user ID
  }));
}