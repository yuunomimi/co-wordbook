import type { Word } from "../types/Word";
import "./WordItem.css";
import { useState, useRef, useEffect } from "react";
import { Ellipsis } from "lucide-react";

type WordItemProps = {
  word: Word;
  onUpdateClick: () => void;
  onDeleteClick: () => void;
};

function WordItem({ word, onUpdateClick, onDeleteClick }: WordItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const moreActions = ["編集", "削除"];

  return (
    <div className="word-item" onClick={() => setIsFlipped(!isFlipped)}>
      {isFlipped ? <p>{word.meaning}</p> : <h3>{word.word}</h3>}

      <div className="word-item-more-wrap" ref={moreMenuRef}>
        <button
          className="word-item-more"
          onClick={(event) => {
            event.stopPropagation();
            setIsMoreOpen((prev) => !prev);
          }}
          aria-label="単語メニュー"
        >
          <Ellipsis width={24} height={24} />
        </button>

        {isMoreOpen && (
          <ul className="word-item-more-menu" onClick={(event) => event.stopPropagation()}>
            {moreActions.map((action) => (
              <li key={action}
                onClick={() => {
                  if (action === "編集") {
                    onUpdateClick();
                  }
                  if (action === "削除") {
                    onDeleteClick();
                  }
                  // Add logic for other actions if needed
                }}
              >
                {action}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WordItem;