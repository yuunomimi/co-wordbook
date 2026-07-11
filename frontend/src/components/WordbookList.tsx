import type { Wordbook } from "../types/Wordbook";
import { PlusIcon } from "./icons";
import WordbookItem from "./WordbookItem";
import "./WordbookList.css";

function WordbookList({ wordbooks }: { wordbooks: Wordbook[] }) {
  return (
    <div className="wordbook-list">
      <button className="wordbook-item create-wordbook-item">
        <PlusIcon width={32} height={32} />
        <h3>新規作成</h3>
      </button>
      {wordbooks.map((wordbook) => (
        <WordbookItem key={wordbook.id} wordbook={wordbook} />
      ))}
    </div>
  );
}

export default WordbookList;