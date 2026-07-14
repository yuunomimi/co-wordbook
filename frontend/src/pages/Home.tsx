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
import { clearAuthContext, useAuth } from "../contexts/AuthContext";
import './Home.css';

function Home() {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchParams] = useSearchParams();
  const sidebarFilter = (searchParams.get("filter") as SidebarFilter) || "home";

  useEffect(() => {
    fetchWordbooks()
      .then(wordbooks => {
        setWordbooks(wordbooks.map((wordbook) => ({
          ...wordbook,
          isMine: wordbook.ownerId === user?.id
        })));
      })
      .catch((error: unknown) => {
        if (error instanceof UnauthorizedError) {
          clearAuthContext();
          navigate("/login", { replace: true });
        }
      });
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
      <WordbookList wordbooks={visibleWordbooks} />
    </div>
  );
}

export default Home;