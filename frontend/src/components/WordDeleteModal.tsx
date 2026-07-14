import "./WordDeleteModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { deleteWord } from "../services/words";
import type { Wordbook } from "../types/Wordbook";
import type { Word } from "../types/Word";

type Props = {
  currentWordbook: Wordbook | null;
  currentWord: Word | null;
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
};

function WordDeleteModal({ currentWordbook, currentWord, onClose, onDeleted }: Props) {
  if (!currentWordbook || !currentWord) {
    return null; // currentWordbookまたはcurrentWordがnullの場合は何も表示しない
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await deleteWord(currentWordbook!.id, currentWord!.id);
      await onDeleted();
      onClose();
    } catch (error) {
      setErrorMessage("単語の削除に失敗しました。再度お試しください。");
      console.error("Error deleting word:", error);
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

      <form className="delete-word-form" onSubmit={handleSubmit}>
        <h1 className="delete-word-title">単語を削除</h1>

        {errorMessage && <p className="delete-word-error">{errorMessage}</p>}

        <p className="delete-word-warning">
          この操作は元に戻せません。
        </p>

        <button className="delete-word-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "削除中..." : "削除"}
        </button>
      </form>
    </div>
  );
}

export default WordDeleteModal;