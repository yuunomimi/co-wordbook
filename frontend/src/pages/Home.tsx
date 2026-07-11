import type { Wordbook } from "../types/Wordbook";
import { fetchWordbooks } from "../services/wordbooks";
import WordbookList from "../components/WordbookList";
import SortMenu from "../components/SortMenu";
import { useState, useEffect } from "react";
import { HomeIcon, MyBookIcon, SharedBookIcon, FriendsIcon, UserIcon, SearchIcon } from "../components/icons";
import './Home.css';

function Home() {
  const [wordbooks, setWordbooks] = useState<Wordbook[]>([]);
  useEffect(() => {
    fetchWordbooks().then(setWordbooks);
  }, []);

  return (
    <main className="home">
      <div className="sidebar">
        <h1>Co-WordBook</h1>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <HomeIcon width={32} height={32} />
            ホーム
          </li>
          <li className="sidebar-item">
            <MyBookIcon width={32} height={32} />
            マイ単語帳
          </li>
          <li className="sidebar-item">
            <SharedBookIcon width={32} height={32} />
            共有単語帳
          </li>
        </ul>
        <div className="sidebar-settings">
          <div className="sidebar-item">
            <FriendsIcon width={32} height={32} />
            フレンド
          </div>
          <div className="sidebar-item">
            <UserIcon width={32} height={32} />
            設定
          </div>
        </div>
      </div>

      <div className="wordbooklist-area">
        <div className="search-bar">
          <SearchIcon className="search-icon" width={32} height={32} />
          <input type="text" placeholder="単語帳を検索" />
        </div>
        <SortMenu />
        <WordbookList wordbooks={wordbooks} />
      </div>
    </main>
  );
}

export default Home;