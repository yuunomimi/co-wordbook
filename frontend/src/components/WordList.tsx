import type { Word } from "../types/Word";
import WordItem from "./WordItem";

function WordList({ words }: { words: Word[] }) {
  return (
    <div className="word-list">
      {words.map((word) => (
        <WordItem key={word.id} word={word} />
      ))}
    </div>
  );
}

export default WordList;