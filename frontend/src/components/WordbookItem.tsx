import type { Wordbook } from "../types/Wordbook";
import CardBackground from "./CardBackground";
import CardRing from "./CardRing";
import { ClockIcon, MoreIcon } from "./icons";
import "./WordbookItem.css";

function WordbookItem({ wordbook }: { wordbook: Wordbook }) {
  return (
    <div className="wordbook-item">
      <CardBackground className="wordbook-item-bg" color={wordbook.themeColor} />
      <CardRing className="wordbook-item-ring" />
      <div className="wordbook-item-content">
        <h3>{wordbook.title}</h3>
        <p>作成者：{wordbook.isMine ? "自分" : "他のユーザー"}</p>
        <p>
          <ClockIcon width={16} height={16} />
          {new Date(wordbook.updatedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
      </div>
      <button className="wordbook-item-more">
        <MoreIcon width={24} height={24} />
      </button>
    </div>
  );
}

export default WordbookItem;