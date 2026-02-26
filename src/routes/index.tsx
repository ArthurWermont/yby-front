import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import CollectionPoint from "../collection-point/collection-point";
import { AuthContext } from "../context/auth-context";
import Dashboard from "../dashboard";
import Edit from "../edit";
import ForgotPassword from "../login/forgot-password";
import ResetPassword from "../login/reset-password";
import SignIn from "../login/signIn-admin";
import SignInClient from "../login/singin-client";
import PlanningList from "../plannings";
import Register from "../register";
import Reports from "../reports";
import { ReportsProvider } from "../reports/context";
import GeneratePDF from "../reports/exports/pdf";
import ResponsiveDrawerLayout from "../template/drawer";
import { PrivateRoute } from "./privateRoute";

export const AppRoutes = () => {
  const { user: currentUser } = useContext(AuthContext);
  const isCooperative = !!currentUser?.cooperative_id;
  const isAdmin = !!currentUser?.isAdmin;

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signIn-client" element={<SignInClient />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/relatorios/pdf" element={<GeneratePDF />} />

      {/* Rotas protegidas */}
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<ResponsiveDrawerLayout />}>
          {/* Rotas específicas por role */}
          {!isCooperative && (
            <Route
              path="/relatorios"
              element={
                <ReportsProvider>
                  <Reports />
                </ReportsProvider>
              }
            />
          )}

          {/* Dashboard baseado no tipo de usuário */}
          <Route path="dashboard" element={<RoleBasedDashboard />} />

          {/* Rotas específicas por role */}
          {isAdmin && (
            <>
              <Route
                path="cadastro/cliente"
                element={<Register type="cliente" />}
              />
              <Route
                path="cadastro/cooperativa"
                element={<Register type="cooperativa" />}
              />
              <Route path="edit/client" element={<Edit type="cliente" />} />
              <Route path="planejamento" element={<PlanningList />} />
            </>
          )}

          {/* Rotas específicas por role*/}
          {isCooperative && (
            <Route path="ponto-coleta" element={<CollectionPoint />} />
          )}

          {/* Rota padrão após login */}
          <Route path="/" element={<DefaultRedirect />} />
          <Route path="*" element={<Navigate to="/relatorios" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const RoleBasedDashboard = () => {
  const { user } = useContext(AuthContext);
  const isClient = !!user?.client_id;
  const isAdmin = !!user?.isAdmin;

  if (isAdmin) return <Dashboard mode="admin" />;
  if (isClient) return <Dashboard mode="client" />;
  return <Navigate to="/" />;
};

const DefaultRedirect = () => {
  const { user } = useContext(AuthContext);
  const isCooperative = !!user?.cooperative_id;

  if (isCooperative) return <Navigate to="/ponto-coleta" />;
  return <Navigate to="/relatorios" />;
};
