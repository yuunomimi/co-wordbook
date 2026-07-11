import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import MainLayout from "./pages/MainLayout";
import WordbookPage from "./pages/WordbookPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="wordbooks/:id" element={<WordbookPage />} />
    </Routes>
  );
}

export default App;