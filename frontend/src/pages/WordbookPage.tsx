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

function WordbookPage() {
  const { id } = useParams()
  const navigate = useNavigate();
  const [wordbook, setWordbook] = useState<Wordbook | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const { user } = useAuth();

  useEffect(() => {
    fetchWordbookById(Number(id))
      .then(wordbook => {
        if (wordbook) {
          setWordbook({
            ...wordbook,
            isMine: wordbook.ownerId === user?.id
          });
        } else {
          setWordbook(null);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });

    fetchWordsByWordbookId(Number(id))
      .then(setWords)
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });
  }, [id, navigate])

  return (
    <main className="wordbook-page">
      {wordbook ? (
        <div className="wordbook-container">
          <h1 className="wordbook-title">
            {wordbook.title}
            {wordbook.isPublic ?
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
            <p>作成者：{wordbook.isMine ? "自分" : "他のユーザー"}</p>
            <p>共同編集者：(TEST)</p>
          </div>
          <p className="wordbook-description">{wordbook.description}</p>
          <span className="divider"></span>
          <WordList words={words} />
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