import { useContext, type FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const PrivateRoute: FC = () => {
  const { user: currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/signIn" replace />;
  }

  return <Outlet />;
};
