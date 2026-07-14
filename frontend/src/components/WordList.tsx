import { Plus } from "lucide-react";
import type { Word } from "../types/Word";
import WordItem from "./WordItem";
import "./WordList.css";

type WordListProps = {
  words: Word[];
  onAddWordClick: () => void;
  onUpdateWordClick: (word: Word) => void;
  onDeleteWordClick: (word: Word) => void;
};

function WordList({ words, onAddWordClick, onUpdateWordClick, onDeleteWordClick }: WordListProps) {
  return (
    <div className="word-list">
      <button className="word-item add-word-item" onClick={onAddWordClick}>
        <Plus width={32} height={32} />
        <h3>単語を追加</h3>
      </button>
      {words.map((word) => (
        <WordItem
          key={word.id}
          word={word}
          onUpdateClick={() => onUpdateWordClick(word)}
          onDeleteClick={() => onDeleteWordClick(word)}
        />
      ))}
    </div>
  );
}

export default WordList;