import type { Wordbook } from "../types/Wordbook";
import { Plus } from "lucide-react";
import WordbookItem from "./WordbookItem";
import "./WordbookList.css";

type props = {
  wordbooks: Wordbook[];
  onCreateWordbookClick: () => void;
  onUpdateWordbookClick: (wordbook: Wordbook) => void;
};

function WordbookList({ wordbooks, onCreateWordbookClick, onUpdateWordbookClick }: props) {
  return (
    <div className="wordbook-list">
      <button className="wordbook-item create-wordbook-item" onClick={() => onCreateWordbookClick()}>
        <Plus width={32} height={32} />
        <h3>新規作成</h3>
      </button>
      {wordbooks.map((wordbook) => (
        <WordbookItem
          key={wordbook.id}
          wordbook={wordbook}
          onUpdateClick={() => onUpdateWordbookClick(wordbook)}
        />
      ))}
    </div>
  );
}

export default WordbookList;