import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import "./LoginPage.css";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useAuth();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await login({ username, password });
      setUser(response);
      navigate("/", { replace: true });
    } catch {
      setErrorMessage("ログインに失敗しました。ユーザー名とパスワードを確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Co-WordBook</h1>

        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <label className="login-field">
          <span>username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="username"
            autoComplete="username"
            required
          />
        </label>

        <label className="login-field">
          <span>password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="password"
            autoComplete="current-password"
            required
          />
        </label>

        <button className="login-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "ログイン中..." : "Login"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;