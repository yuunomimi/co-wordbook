import { useEffect, useRef, useState } from "react";
import type { Wordbook } from "../types/Wordbook";
import CardBackground from "./CardBackground";
import CardRing from "./CardRing";
import { Clock3, Ellipsis } from "lucide-react";
import "./WordbookItem.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type WordbookItemProps = {
  wordbook: Wordbook;
  onUpdateClick: () => void;
};

function WordbookItem({ wordbook, onUpdateClick, onDeleteClick }: WordbookItemProps & { onDeleteClick: () => void }) {
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="wordbook-item"
      onClick={() => navigate(`/wordbooks/${wordbook.id}`)}>
      <CardBackground className="wordbook-item-bg" color={wordbook.themeColor} />
      <CardRing className="wordbook-item-ring" />
      <div className="wordbook-item-content">
        <h3>{wordbook.title}</h3>
        <p>作成者：{wordbook.isMine ? "自分" : "他のユーザー"}</p>
        <p>
          <Clock3 width={16} height={16} />
          {new Date(wordbook.updatedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
      </div>

      {user?.id === wordbook.ownerId && (
        <div className="wordbook-item-more-wrap" ref={moreMenuRef}>
          <button
            className="wordbook-item-more"
            onClick={(event) => {
              event.stopPropagation();
              setIsMoreOpen((prev) => !prev);
            }}
            aria-label="単語帳メニュー"
          >
            <Ellipsis width={24} height={24} />
          </button>

          {isMoreOpen && (
            <ul className="wordbook-item-more-menu" onClick={(event) => event.stopPropagation()}>
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
      )}
    </div>
  );
}

export default WordbookItem;