import "./WordUpdateModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { updateWord } from "../services/words";
import type { Word, NewWord } from "../types/Word";
import type { Wordbook } from "../types/Wordbook";

type Props = {
  currentWordbook: Wordbook | null;
  currentWord: Word | null;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
};

function WordUpdateModal({ currentWordbook, currentWord, onClose, onUpdated }: Props) {
  if (!currentWordbook || !currentWord) {
    return null; // currentWordbookまたはcurrentWordがnullの場合は何も表示しない
  }

  const [word, setWord] = useState(currentWord.word);
  const [meaning, setMeaning] = useState(currentWord.meaning);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const newWord: NewWord = {
      word,
      meaning,
      memorable: currentWord!.memorable, // 既存の単語のmemorable値を保持
    };

    try {
      await updateWord(currentWordbook!.id, currentWord!.id, newWord);
      await onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating word:", error);
      setErrorMessage("単語の更新に失敗しました。再度お試しください。");
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

      <form className="update-word-form" onSubmit={handleSubmit}>
        <h1 className="update-word-title">単語を更新</h1>

        {errorMessage && <p className="update-word-error">{errorMessage}</p>}

        <label className="update-word-field">
          <span>単語</span>
          <input
            placeholder="単語"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </label>
        <label className="update-word-field">
          <span>意味</span>
          <textarea
            placeholder="意味"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
          />
        </label>
        <button className="update-word-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
}

export default WordUpdateModal;