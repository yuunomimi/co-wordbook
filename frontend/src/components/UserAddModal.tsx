import "./UserAddModal.css";
import { X } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { addUserToWordbook } from "../services/users";

type Props = {
  currentWordbook: { id: number } | null;
  onClose: () => void;
  onAdded: () => Promise<void> | void;
};

function UserAddModal({ currentWordbook, onClose, onAdded }: Props) {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await addUserToWordbook(currentWordbook!.id, username);
      await onAdded();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
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

      <form className="add-user-form" onSubmit={handleSubmit}>
        <h1 className="add-user-title">ユーザー名でユーザーを追加</h1>
        <label className="add-user-field">
          <span>ユーザー名</span>
          <input
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button className="add-user-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "追加中..." : "追加"}
        </button>
      </form>
    </div>
  );
}

export default UserAddModal;