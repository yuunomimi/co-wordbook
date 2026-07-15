export type Wordbook = {
  id: number;
  title: string;
  description: string;
  themeColor: string;
  ownerId: number;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isShared: boolean;
};

export type NewWordbook = {
  title: string;
  description: string;
  themeColor: string;
};