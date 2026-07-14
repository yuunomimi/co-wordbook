import { Globe, House, LogOut, SwatchBook, UserCog, Users } from "lucide-react";
import "./Sidebar.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logout } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

export type SidebarFilter = "home" | "my" | "shared";

function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const sidebarFilter = (searchParams.get("filter") as SidebarFilter) ?? "home";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  }
  
  return (
    <aside className="sidebar">
      <h1>Co-WordBook</h1>
      <ul className="sidebar-nav">
        <li
          className={`sidebar-item ${sidebarFilter === "home" ? "active" : ""}`}
          onClick={() => setSearchParams({})}
        >
          <House width={32} height={32} />
          ホーム
        </li>
        <li
          className={`sidebar-item ${sidebarFilter === "my" ? "active" : ""}`}
          onClick={() => setSearchParams({ filter: "my" })}
        >
          <SwatchBook width={32} height={32} />
          マイ単語帳
        </li>
        <li
          className={`sidebar-item ${sidebarFilter === "shared" ? "active" : ""}`}
          onClick={() => setSearchParams({ filter: "shared" })}
        >
          <Globe width={32} height={32} />
          みんなの単語帳
        </li>
      </ul>
      <div className="sidebar-settings">
        {/* <div className="sidebar-item">
          <Users width={32} height={32} />
          フレンド
        </div> */}
        <div className="sidebar-settings-wrap" ref={settingsMenuRef}>
          <button
            type="button"
            className={`sidebar-item sidebar-settings-button ${isSettingsOpen ? "active" : ""}`}
            onClick={() => setIsSettingsOpen((prev) => !prev)}
          >
            <UserCog width={32} height={32} />
            設定
          </button>

          {isSettingsOpen && (
            <ul className="sidebar-settings-menu">
              <li className="sidebar-settings-menu-label">
                {  user?.username }
              </li>
              <li className="sidebar-settings-menu-item" onClick={handleLogout}>
                <LogOut width={20} height={20} />
                ログアウト
              </li>
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;