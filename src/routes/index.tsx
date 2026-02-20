import { Navigate, useRoutes } from "react-router-dom";
import CollectionPoint from "../collection-point/collection-point";
import Dashboard from "../dashboard";
import Edit from "../edit";
import ForgotPassword from "../login/forgot-password";
import ResetPassword from "../login/reset-password";
import SignIn from "../login/signIn-admin";
import SignInClient from "../login/singin-client";
import PlanningList from "../plannings";
import Register from "../register";
import { AdminGuard } from "./adminGuard";
import { ClientGuard } from "./clientGuard";
import { CooperativeGuard } from "./cooperativeGuard";
import { PrivateRoute } from "./privateRoute";

export const Routes = () => {
  const routes = useRoutes([
    // Admin routes
    {
      path: "",
      element: (
        <PrivateRoute>
          <AdminGuard />
        </PrivateRoute>
      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard mode="admin" />,
        },
        {
          path: "cadastro",
          children: [
            {
              index: true,
              path: "cliente",
              element: <Register type="cliente" />,
            },
            {
              path: "cooperativa",
              element: <Register type="cooperativa" />,
            },
          ],
        },
        {
          path: "edit/client",
          element: <Edit type="cliente" />,
        },
        {
          path: "planejamento",
          element: <PlanningList />,
        },
      ],
    },

    // Client routes
    {
      path: "",
      element: (
        <PrivateRoute>
          <ClientGuard />
        </PrivateRoute>
      ),
      children: [
        { path: "dashboard-client", element: <Dashboard mode="client" /> },
      ],
    },

    // Cooperative routes
    {
      path: "",
      element: (
        <PrivateRoute>
          <CooperativeGuard />
        </PrivateRoute>
      ),
      children: [
        {
          path: "ponto-coleta",
          element: <CollectionPoint />,
        },
        {
          path: "*",
          element: <Navigate to="/ponto-coleta" />,
        },
      ],
    },

    // Public routes
    {
      path: "signIn",
      element: <SignIn />,
    },
    {
      path: "signIn-client",
      element: <SignInClient />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },

    {
      path: "reset-password",
      element: <ResetPassword />,
    },

    // Catch routes
    {
      path: "",
      element: <PrivateRoute />,
      children: [
        {
          path: "*",
          element: <Navigate to="relatorios" />,
        },
      ],
    },
  ]);

  return routes;
};
