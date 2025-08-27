import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

type User = {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

type AuthContextType = {
  currentUser: User | null;
  login: (inputs: any) => Promise<void>;
  logout: (inputs?: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (inputs: any) => {
    try {
      const res = await axios.post("http://localhost:3001/auth/login", inputs, {
        withCredentials: true,
      });
      console.log("Login response:", res.data); // ✅ This should log user data
      setCurrentUser(res.data);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

    const logout = async () => {
    try {
        await axios.post("http://localhost:3001/auth/logout", {}, {
        withCredentials: true,
      });
    } catch (err) {
        console.error(err);
    }
    setCurrentUser(null);
    localStorage.removeItem("user"); // remove stored user immediately
    };
    
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
