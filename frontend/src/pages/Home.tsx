import type { Wordbook } from "../types/Wordbook";
import { fetchWordbooks } from "../services/wordbooks";
import WordbookList from "../components/WordbookList";
import SortMenu from "../components/SortMenu";
import type { SortKey } from "../components/SortMenu";
import { useState, useEffect, useMemo } from "react";
import { type SidebarFilter } from "../components/Sidebar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { UnauthorizedError } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import './Home.css';
import WordbookCreateModal from "../components/WordbookCreateModal";
import WordbookUpdateModal from "../components/WordbookUpdateModal";
import WordbookDeleteModal from "../components/WordbookDeleteModal";

function Home() {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [isCreateWordbookModalOpen, setIsCreateWordbookModalOpen] = useState(false);
  const [isUpdateWordbookModalOpen, setIsUpdateWordbookModalOpen] = useState(false);
  const [isDeleteWordbookModalOpen, setIsDeleteWordbookModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [targetWordbook, setTargetWordbook] = useState<Wordbook | null>(null);

  const [searchParams] = useSearchParams();
  const sidebarFilter = (searchParams.get("filter") as SidebarFilter) || "home";

  const loadWordbooks = () => {
    return fetchWordbooks()
      .then((wordbooks) => {
        setWordbooks(wordbooks.map((wordbook) => ({
          ...wordbook,
          isMine: wordbook.ownerId === user?.id
        })));
      })
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          setUser(null);
          navigate("/login", { replace: true });
        }
      });
  };

  useEffect(() => {
    loadWordbooks();
  }, [navigate]);

  const visibleWordbooks = useMemo(() => {
    const filteredWordbooks = wordbooks.filter((wordbook) => {
      if (sidebarFilter === "my") {
        return wordbook.isMine;
      }

      if (sidebarFilter === "shared") {
        return !wordbook.isMine;
      }

      return true;
    });

    return [...filteredWordbooks].sort((a, b) => {
      if (sortKey === "name") {
        return a.title.localeCompare(b.title, "ja");
      }

      if (sortKey === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [wordbooks, sidebarFilter, sortKey]);

  return (
    <div className="wordbooklist-area">
      <div className="search-bar">
        <Search className="search-icon" width={32} height={32} />
        <input type="text" placeholder="単語帳を検索" />
      </div>

      <SortMenu className="sort-menu" value={sortKey} onChange={setSortKey} />

      <WordbookList
        wordbooks={visibleWordbooks}
        onCreateWordbookClick={() => setIsCreateWordbookModalOpen(true)}
        onUpdateWordbookClick={(wordbook) => {
          setTargetWordbook(wordbook);
          setIsUpdateWordbookModalOpen(true);
        }}
        onDeleteWordbookClick={(wordbook) => {
          setTargetWordbook(wordbook);
          setIsDeleteWordbookModalOpen(true);
        }}
      />

      {isCreateWordbookModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setIsCreateWordbookModalOpen(false);
        }}>
          <WordbookCreateModal
            onClose={() => setIsCreateWordbookModalOpen(false)}
            onCreated={loadWordbooks}
          />
        </div>
      )}
      {isUpdateWordbookModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setIsUpdateWordbookModalOpen(false);
        }}>
          <WordbookUpdateModal
            currentWordbook={targetWordbook}
            onClose={() => setIsUpdateWordbookModalOpen(false)}
            onUpdated={loadWordbooks}
          />
        </div>
      )}
      {isDeleteWordbookModalOpen && (
        <div className="modal-overlay" onClick={() => {
          setIsDeleteWordbookModalOpen(false);
        }}>
          <WordbookDeleteModal
            currentWordbook={targetWordbook}
            onClose={() => setIsDeleteWordbookModalOpen(false)}
            onDeleted={loadWordbooks}
          />
        </div>
      )}
    </div>
  );
}

export default Home;