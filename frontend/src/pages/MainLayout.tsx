import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

export default function MainLayout() {
  return (
    <main className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </main>
  );
}