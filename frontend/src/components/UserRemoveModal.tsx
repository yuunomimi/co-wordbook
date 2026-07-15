import "./UserRemoveModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { removeUserFromWordbook } from "../services/users";
import type { Wordbook } from "../types/Wordbook";
import type { User } from "../types/User";

type Props = {
  currentWordbook: Wordbook | null;
  currentUser: User | null;
  onClose: () => void;
  onRemoved: () => Promise<void> | void;
};

function UserRemoveModal({ currentWordbook, currentUser, onClose, onRemoved }: Props) {
  if (!currentWordbook || !currentUser) {
    return null; // currentWordbookまたはcurrentUserがnullの場合は何も表示しない
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await removeUserFromWordbook(currentWordbook!.id, currentUser!.id);
      await onRemoved();
      onClose();
    } catch (error) {
      setErrorMessage("ユーザーの削除に失敗しました。再度お試しください。");
      console.error("Error removing user:", error);
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

      <form className="remove-user-form" onSubmit={handleSubmit}>
        <h1 className="remove-user-title">{currentUser?.username}を削除</h1>

        {errorMessage && <p className="remove-user-error">{errorMessage}</p>}

        <p className="remove-user-warning">
          本当に削除しますか？
        </p>

        <button className="remove-user-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "削除中..." : "削除"}
        </button>
      </form>
    </div>
  );
}

export default UserRemoveModal;