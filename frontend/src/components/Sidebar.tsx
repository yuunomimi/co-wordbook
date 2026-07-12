import { Globe, House, SwatchBook, UserCog, Users } from "lucide-react";
import "./Sidebar.css";
import { useSearchParams } from "react-router-dom";

export type SidebarFilter = "home" | "my" | "shared";

function Sidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sidebarFilter = (searchParams.get("filter") as SidebarFilter) ?? "home";
  
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
          共有単語帳
        </li>
      </ul>
      <div className="sidebar-settings">
        <div className="sidebar-item">
          <Users width={32} height={32} />
          フレンド
        </div>
        <div className="sidebar-item">
          <UserCog width={32} height={32} />
          設定
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;