import "./WordAddModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { addWord } from "../services/words";
import type { NewWord } from "../types/Word";

type Props = {
  currentWordbook: { id: number } | null;
  onClose: () => void;
  onAdded: () => Promise<void> | void;
};

function WordAddModal({ currentWordbook, onClose, onAdded }: Props) {
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const newWord: NewWord = {
      word,
      meaning,
    };

    try {
      await addWord(currentWordbook!.id, newWord);
      await onAdded();
      onClose();
    } catch (error) {
      console.error("Error creating word:", error);
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

      <form className="add-word-form" onSubmit={handleSubmit}>
        <h1 className="add-word-title">単語を追加</h1>
        <label className="add-word-field">
          <span>単語</span>
          <input
            placeholder="単語"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </label>
        <label className="add-word-field">
          <span>意味</span>
          <textarea
            placeholder="意味"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
          />
        </label>
        <button className="add-word-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "追加中..." : "追加"}
        </button>
      </form>
    </div>
  );
}

export default WordAddModal;