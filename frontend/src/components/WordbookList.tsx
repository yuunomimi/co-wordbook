import type { Wordbook } from "../types/Wordbook";
import WordbookItem from "./WordbookItem";
import "./WordbookList.css";

function WordbookList({ wordbooks }: { wordbooks: Wordbook[] }) {
  return (
    <div className="wordbook-list">
      {wordbooks.map((wordbook) => (
        <WordbookItem key={wordbook.id} wordbook={wordbook} />
      ))}
    </div>
  );
}

export default WordbookList;