import type { Word } from "../types/Word";

function WordItem({ word }: { word: Word }) {
  return (
    <div className="word-item">
      <h3>{word.word}</h3>
      <p>{word.meaning}</p>
    </div>
  );
}

export default WordItem;