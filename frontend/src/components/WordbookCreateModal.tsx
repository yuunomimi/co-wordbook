import "./WordbookCreateModal.css";
import { X } from "lucide-react";
import ColorRadio from "./ColorRadio";
import { useState, type SubmitEvent } from "react";
import { createWordbook } from "../services/wordbooks";
import type { NewWordbook } from "../types/Wordbook";

type Props = {
  onClose: () => void;
  onCreated: () => void;
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

function WordbookCreateModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState(colors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const newWordbook: NewWordbook = {
      title,
      description,
      themeColor,
    };
    try {
      const response = await createWordbook(newWordbook);
      
      onCreated();
      onClose();
    } catch (error) {
      console.error("Error creating wordbook:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
        >
          <X width={24} height={24} />
        </button>

        <form className="create-wordbook-form" onSubmit={handleSubmit}> 
          <h1 className="create-wordbook-title">単語帳を作成</h1>
          <label className="create-wordbook-field">
            <span>単語帳名</span>
            <input
              placeholder="単語帳名"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="create-wordbook-field">
            <span>説明</span>
            <textarea
              placeholder="説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="create-wordbook-field">
            <span>テーマカラー</span>
            <ColorRadio colors={colors} value={themeColor} onColorChange={setThemeColor} />
          </label>
          <button className="create-wordbook-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "作成中..." : "作成"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WordbookCreateModal;