import { useContext, type FC } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const CooperativeGuard: FC = () => {
  const { user: currentUser } = useContext(AuthContext);

  if (currentUser && currentUser.cooperative_id) {
    return <Outlet />;
  }

  return null;
};
