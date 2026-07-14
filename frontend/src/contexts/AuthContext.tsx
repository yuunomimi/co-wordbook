import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchMe } from "../services/auth";

type AuthContextType = {
  user: { id: number; username: string } | null;
  setUser: (user: { id: number; username: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetchMe();
        setUser(response);
      } catch (error) {
        setUser(null);
        console.error("Failed to fetch user info:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const clearAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("clearAuthContext must be used within an AuthProvider");
  }
  context.setUser(null);
};