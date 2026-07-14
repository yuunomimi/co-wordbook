import "./WordbookDeleteModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { deleteWordbook } from "../services/wordbooks";
import type { Wordbook } from "../types/Wordbook";

type Props = {
  currentWordbook: Wordbook | null;
  onClose: () => void;
  onDeleted: () => Promise<void> | void;
};

function WordbookDeleteModal({ currentWordbook, onClose, onDeleted }: Props) {
  if (!currentWordbook) {
    return null; // currentWordbookがnullの場合は何も表示しない
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await deleteWordbook(currentWordbook!.id);
      await onDeleted();
      onClose();
    } catch (error) {
      setErrorMessage("単語帳の削除に失敗しました。再度お試しください。");
      console.error("Error deleting wordbook:", error);
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

      <form className="delete-wordbook-form" onSubmit={handleSubmit}>
        <h1 className="delete-wordbook-title">単語帳を削除</h1>

        {errorMessage && <p className="delete-wordbook-error">{errorMessage}</p>}

        <p className="delete-wordbook-warning">
          この操作は元に戻せません。削除すると、単語帳内のすべての単語が失われます。
        </p>

        <button className="delete-wordbook-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "削除中..." : "削除"}
        </button>
      </form>
    </div>
  );
}

export default WordbookDeleteModal;