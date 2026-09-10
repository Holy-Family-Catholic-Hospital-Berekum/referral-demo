import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const value = {
    user: user ?? null,
    loading: user === undefined,
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
