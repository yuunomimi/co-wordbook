import { useState } from "react";
import type { Wordbook } from "../types/Wordbook";
import { Plus } from "lucide-react";
import WordbookItem from "./WordbookItem";
import "./WordbookList.css";
import WordbookCreateModal from "./WordbookCreateModal";

type props = {
  wordbooks: Wordbook[];
  onWordbookCreated: () => {},
};

function WordbookList({ wordbooks, onWordbookCreated }: props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <div className="wordbook-list">
        <button className="wordbook-item create-wordbook-item" onClick={() => setIsCreateOpen(true)}>
          <Plus width={32} height={32} />
          <h3>新規作成</h3>
        </button>
        {wordbooks.map((wordbook) => (
          <WordbookItem key={wordbook.id} wordbook={wordbook} />
        ))}
      </div>
      {isCreateOpen && (
        <WordbookCreateModal onClose={() => setIsCreateOpen(false)} onCreated={onWordbookCreated} />
      )}
    </>
  );
}

export default WordbookList;