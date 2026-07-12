import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import type { Wordbook } from "../types/Wordbook"
import type { Word } from "../types/Word"
import { fetchWordbookById } from "../services/wordbooks"
import { fetchWordsByWordbookId } from "../services/words"
import './WordbookPage.css'
import WordList from "../components/WordList"
import { Globe, Lock } from "lucide-react"

function WordbookPage() {
  const { id } = useParams()
  const [wordbook, setWordbook] = useState<Wordbook | null>(null)
  const [words, setWords] = useState<Word[]>([])

  useEffect(() => {
    fetchWordbookById(Number(id)).then(setWordbook);
    fetchWordsByWordbookId(Number(id)).then(setWords);
  }, [])

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