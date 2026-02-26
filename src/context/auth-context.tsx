import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: {
    jwt: string;
    username: string;
    documentId: string;
    email: string;
    isAdmin: boolean;
    id: number;
    cooperative_id?: string;
    client_id?: string;
  } | null;
  login: (user: {
    jwt: string;
    username: string;
    documentId: string;
    email: string;
    isAdmin: boolean;
    id: number;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextProps["user"]>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuario");
    if (dadosUsuario) {
      setUser(JSON.parse(dadosUsuario));

      if (!location.pathname.includes("relatorios/pdf"))
        navigate("/", { replace: true });
    }
  }, []);

  const login = (user: {
    jwt: string;
    username: string;
    documentId: string;
    email: string;
    isAdmin: boolean;
    id: number;
  }) => {
    localStorage.setItem("usuario", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
