import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import MainLayout from "./pages/MainLayout";
import WordbookPage from "./pages/WordbookPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route
          path="wordbooks/:id"
          element={<WordbookPage />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;