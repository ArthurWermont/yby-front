import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: {
    jwt: string;
    username: string;
    documentId: string;
    email: string;
    isAdmin: boolean;
    isManager?: boolean;
    role?: string | null;
    id: number;
    cooperative_id?: string | null;
    client_id?: string | null;
    clients?: {
      id: number;
      documentId?: string;
      client_id?: string;
      social_name?: string;
    }[];

    // NOVO: relação correta para o gestor na nova arquitetura
    manager?: {
      documentId?: string;
      clients?: {
        id: number;
        documentId?: string;
        client_id?: string;
        social_name?: string;
      }[];
    } | null;
  } | null;
  login: (user: {
    jwt: string;
    username: string;
    documentId: string;
    email: string;
    isAdmin: boolean;
    isManager?: boolean;
    role?: string | null;
    id: number;
    cooperative_id?: string | null;
    client_id?: string | null;
    clients?: {
      id: number;
      documentId?: string;
      client_id?: string;
      social_name?: string;
    }[];

    // NOVO: relação correta para o gestor na nova arquitetura
    manager?: {
      documentId?: string;
      clients?: {
        id: number;
        documentId?: string;
        client_id?: string;
        social_name?: string;
      }[];
    } | null;
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
    isManager?: boolean;
    role?: string | null;
    id: number;
    cooperative_id?: string | null;
    client_id?: string | null;
    clients?: {
      id: number;
      documentId?: string;
      client_id?: string;
      social_name?: string;
    }[];

    // NOVO: relação correta para o gestor na nova arquitetura
    manager?: {
      documentId?: string;
      clients?: {
        id: number;
        documentId?: string;
        client_id?: string;
        social_name?: string;
      }[];
    } | null;
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
