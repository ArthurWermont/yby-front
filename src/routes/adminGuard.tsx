import { useContext, type FC } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const AdminGuard: FC = () => {
  const { user: currentUser } = useContext(AuthContext);

  if (currentUser && currentUser.isAdmin) {
    return <Outlet />;
  }

  return null;
};
