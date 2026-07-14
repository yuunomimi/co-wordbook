import "./WordbookUpdateModal.css";
import { X } from "lucide-react";
import ColorRadio from "./ColorRadio";
import { useState, type SubmitEvent } from "react";
import { updateWordbook } from "../services/wordbooks";
import type { Wordbook, NewWordbook } from "../types/Wordbook";

type Props = {
  currentWordbook: Wordbook | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
};

const colors = [
  "#A8D8B9", // パステルグリーン
  "#AFCBFF", // パステルブルー
  "#CDB4F6", // パステルパープル
  "#F7B7D2", // パステルピンク
  "#FFD6A5", // パステルオレンジ
  "#FFF3A3", // パステルイエロー
  "#B8E6E1", // パステルミント
  "#D8C4A5", // パステルベージュ
];

function WordbookUpdateModal({ currentWordbook, onClose, onUpdated }: Props) {
  if (!currentWordbook) {
    return null; // currentWordbookがnullの場合は何も表示しない
  }
  const [title, setTitle] = useState(currentWordbook.title);
  const [description, setDescription] = useState(currentWordbook.description);
  const [themeColor, setThemeColor] = useState(currentWordbook.themeColor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const newWordbook: NewWordbook = {
      title,
      description,
      themeColor,
    };

    try {
      await updateWordbook(currentWordbook!.id, newWordbook);
      await onUpdated();
      onClose();
    } catch (error) {
      setErrorMessage("単語帳の更新に失敗しました。再度お試しください。");
      console.error("Error updating wordbook:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={onClose}
        type="button"
      >
        <X width={24} height={24} />
      </button>

      <form className="update-wordbook-form" onSubmit={handleSubmit}>
        <h1 className="update-wordbook-title">単語帳を更新</h1>

        {errorMessage && <p className="update-wordbook-error">{errorMessage}</p>}

        <label className="update-wordbook-field">
          <span>単語帳名</span>
          <input
            placeholder="単語帳名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="update-wordbook-field">
          <span>説明</span>
          <textarea
            placeholder="説明"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="update-wordbook-field">
          <span>テーマカラー</span>
          <ColorRadio colors={colors} value={themeColor} onColorChange={setThemeColor} />
        </label>
        <button className="update-wordbook-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
}

export default WordbookUpdateModal;