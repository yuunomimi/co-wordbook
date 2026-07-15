import { useEffect, useRef, useState } from "react";
import { ChevronDown, Users, Trash2 } from "lucide-react";
import type { User } from "../types/User";
import "./UserList.css";

type UserListProps = {
  className?: string;
  users: User[];
  label?: string;
  isOwner: boolean;
  onAddUserClick: () => void;
  onRemoveUserClick: (user: User) => void;
};

export default function UserList({ className, users, label = "ユーザー", isOwner, onAddUserClick, onRemoveUserClick }: UserListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`user-list ${className || ""}`} ref={menuRef}>
      <button
        type="button"
        className="user-list-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Users width={24} height={24} />
        {label} {users.length}人
        <ChevronDown width={20} height={20} />
      </button>

      {isOpen && (
        <ul className="user-list-menu">
          {users.length > 0 ? (
            users.map((user) => (
              <li className="user-list-item" key={user.id}>
                {user.username}
                {isOwner && (
                  <button
                    type="button"
                    className="user-list-remove-button"
                    onClick={() => onRemoveUserClick(user)}
                  >
                    <Trash2 width={16} height={16} />
                  </button>
                )}
              </li>
            ))
          ) : (
            <li className="user-list-empty">共同編集者はいません</li>
          )}
          {onAddUserClick && (
            <li className="user-list-actions">
              <button type="button" className="user-list-add-button" onClick={onAddUserClick}>
                ユーザーを追加
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}