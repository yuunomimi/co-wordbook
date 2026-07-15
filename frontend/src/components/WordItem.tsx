import type { Word } from "../types/Word";
import "./WordItem.css";
import { useState, useRef, useEffect } from "react";
import { Circle, CircleCheckBig, Ellipsis } from "lucide-react";
import { toggleMemorable } from "../services/words";

type WordItemProps = {
  word: Word;
  wordbookId?: number;
  onUpdateClick: () => void;
  onDeleteClick: () => void;
};

function WordItem({ word, wordbookId, onUpdateClick, onDeleteClick }: WordItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const [isMemorable, setIsMemorable] = useState<boolean>(word.memorable);

  function handleMemorableClick() {
    const nextMemorable = !isMemorable;
    setIsMemorable(nextMemorable);

    if (wordbookId) {
      toggleMemorable(wordbookId, word.id, nextMemorable)
        .then((updatedWord) => {
          console.log("Memorable toggled:", updatedWord);
          setIsMemorable(updatedWord.memorable);
        })
        .catch((error) => {
          console.error("Failed to toggle memorable:", error);
          setIsMemorable((prev) => !prev);
        });
    }
  }

  useEffect(() => {
    setIsMemorable(word.memorable);
  }, [word.memorable]);

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
    <div className={`word-item ${isMemorable ? "memorable" : ""}`} onClick={() => setIsFlipped(!isFlipped)}>
      {isFlipped ? <p>{word.meaning}</p> : <h3>{word.word}</h3>}

      <button
        className={`word-item-memorable ${isMemorable ? "memorable" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          handleMemorableClick();
        }}
      >
        {isMemorable ?
        <CircleCheckBig width={24} height={24} /> : <Circle width={24} height={24} />}
      </button>

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