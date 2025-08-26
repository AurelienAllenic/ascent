"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  const isLoggedIn = !!session?.user;
  const userEmail = session?.user?.email ?? null;

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
