"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  isAuthenticated as checkAuth,
  loginUser,
  registerUser,
  logout as doLogout,
} from "@/lib/api";
import api from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (checkAuth()) {
      try {
        const response = await api.get("/accounts/me/");
        setUser(response.data);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
    await fetchUser();
  };

  const register = async (data: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => {
    const response = await registerUser(data);
    setUser(response.user);
  };

  const logout = () => {
    setUser(null);
    doLogout();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
