import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import type { Wordbook } from "../types/Wordbook"
import type { Word } from "../types/Word"
import { fetchWordbookById } from "../services/wordbooks"
import { fetchWordsByWordbookId } from "../services/words"
import './WordbookPage.css'
import WordList from "../components/WordList"
import { Globe, Lock } from "lucide-react"
import { UnauthorizedError } from "../services/api"
import { clearAuthContext } from "../contexts/AuthContext"
import { useAuth } from "../contexts/AuthContext"
import WordAddModal from "../components/WordAddModal"
import WordUpdateModal from "../components/WordUpdateModal"
import WordDeleteModal from "../components/WordDeleteModal"
import type { User } from "../types/User"
import { fetchUsersByWordbookId } from "../services/users"
import UserList from "../components/UserList"
import UserAddModal from "../components/UserAddModal"
import UserRemoveModal from "../components/UserRemoveModal"

function WordbookPage() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [wordbook, setWordbook] = useState<Wordbook | null | undefined>(null)
  const [words, setWords] = useState<Word[]>([])
  const { user } = useAuth();

  const [targetWord, setTargetWord] = useState<Word | null>(null);

  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [isUpdateWordModalOpen, setIsUpdateWordModalOpen] = useState(false);
  const [isDeleteWordModalOpen, setIsDeleteWordModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);

  const isMine = wordbook?.ownerId === user?.id;

  const loadWords = () => {
    fetchWordsByWordbookId(Number(id))
      .then(setWords)
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });
  };

  const loadUsers = () => {
    fetchUsersByWordbookId(Number(id))
      .then(setUsers)
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });
  };

  useEffect(() => {
    fetchWordbookById(Number(id))
      .then(wordbook => {
        if (wordbook) {
          setWordbook({
            ...wordbook,
            isMine: wordbook.ownerId === user?.id
          });
        } else {
          setWordbook(undefined);
        }
      })
      .catch((error: unknown) => {
        setWordbook(undefined);

        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });

    loadWords();
    loadUsers();
  }, [id, navigate])

  return (
    <main className="wordbook-page">
      {wordbook ? (
        <div className="wordbook-container">
          <h1 className="wordbook-title">
            <span className="wordbook-title-icon" style={{ backgroundColor: wordbook.themeColor }} />
            {wordbook.title}
            {wordbook.isShared ?
              <Globe width={24} height={24} /> : <Lock width={24} height={24} />}
          </h1>
          <div className="wordbook-dates">
            <p>
              作成日：{new Date(wordbook.createdAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
            <p>
              最終更新日：{new Date(wordbook.updatedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
          <div className="wordbook-users">
            <p>作成者： {users.find((u) => u.id === wordbook.ownerId)?.username || "自分"}</p>
            <UserList users={users} isOwner={isMine}
              onAddUserClick={() => setIsAddUserModalOpen(true)}
              onRemoveUserClick={(user) => {
                setTargetUser(user);
                setIsRemoveUserModalOpen(true);
              }}
            />
          </div>
          <p className="wordbook-description">{wordbook.description}</p>
          <hr className="divider" />

          <WordList
            words={words}
            wordbookId={wordbook.id}
            onAddWordClick={() => setIsAddWordModalOpen(true)}
            onUpdateWordClick={(word) => {
              setTargetWord(word);
              setIsUpdateWordModalOpen(true);
            }}
            onDeleteWordClick={(word) => {
              setTargetWord(word);
              setIsDeleteWordModalOpen(true);
            }}
          />

          {isAddWordModalOpen && (
            <div className="modal-overlay" onClick={() => setIsAddWordModalOpen(false)}>
              <WordAddModal currentWordbook={wordbook} onClose={() => setIsAddWordModalOpen(false)} onAdded={loadWords} />
            </div>
          )}

          {isUpdateWordModalOpen && (
            <div className="modal-overlay" onClick={() => setIsUpdateWordModalOpen(false)}>
              <WordUpdateModal currentWordbook={wordbook} currentWord={targetWord} onClose={() => setIsUpdateWordModalOpen(false)} onUpdated={loadWords} />
            </div>
          )}

          {isDeleteWordModalOpen && (
            <div className="modal-overlay" onClick={() => setIsDeleteWordModalOpen(false)}>
              <WordDeleteModal currentWordbook={wordbook} currentWord={targetWord} onClose={() => setIsDeleteWordModalOpen(false)} onDeleted={loadWords} />
            </div>
          )}

          {isAddUserModalOpen && (
            <div className="modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
              <UserAddModal currentWordbook={wordbook} onClose={() => setIsAddUserModalOpen(false)} onAdded={loadUsers} />
            </div>
          )}

          {isRemoveUserModalOpen && (
            <div className="modal-overlay" onClick={() => setIsRemoveUserModalOpen(false)}>
              <UserRemoveModal currentWordbook={wordbook} currentUser={targetUser} onClose={() => setIsRemoveUserModalOpen(false)} onRemoved={loadUsers} />
            </div>
          )}
        </div>
      ) : wordbook === null ? (
        <p>Loading...</p>
      ) : wordbook === undefined ? (
        <div className="wordbook-not-found">
          <h2>単語帳が見つかりません</h2>
          <p>指定されたIDの単語帳は存在しないか、アクセス権限がありません。</p>
        </div>
      ) : (
        <p>Wordbook not found</p>
      )}
    </main>
  )
}

export default WordbookPage