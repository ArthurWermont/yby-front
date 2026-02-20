import { useContext, type FC } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const ClientGuard: FC = () => {
  const { user: currentUser } = useContext(AuthContext);

  if (currentUser && currentUser?.client_id && !currentUser?.isAdmin) {
    return <Outlet />;
  }

  return null;
};
