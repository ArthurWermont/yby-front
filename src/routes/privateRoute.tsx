import { Children, useContext, type FC, type PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user: currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/signIn" />;
  }

  if (Children.count(children) > 0) {
    return children;
  }

  return <Outlet />;
};
