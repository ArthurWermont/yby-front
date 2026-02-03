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
import Reports from "../reports_";
import { ReportsProvider } from "../reports_/context";
import ResponsiveDrawerLayout from "../template/drawer";

const MainRoutes = () => {
  const { user: currentUser } = useContext(AuthContext);

  const isClient = !!currentUser?.client_id;
  const isCooperative = !!currentUser?.cooperative_id;
  const isAdmin = !!currentUser?.isAdmin;

  return (
    <Routes>
      {!currentUser && (
        <>
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signIn-client" element={<SignInClient />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/signIn" />} />
        </>
      )}

      {/* Protected Routes */}
      <Route element={<ResponsiveDrawerLayout />}>
        {currentUser && (
          <>
            <Route
              path="/relatorios"
              element={
                <>
                  {/* <Reports /> */}
                  <ReportsProvider>
                    <Reports />
                  </ReportsProvider>
                </>
              }
            />

            {isAdmin && (
              <>
                <Route
                  path="/cadastro"
                  element={<Navigate to="/cadastro/cliente" />}
                />
                <Route path="/dashboard" element={<Dashboard mode="admin" />} />
                <Route
                  path="/cadastro/cliente"
                  element={<Register type="cliente" />}
                />
                <Route
                  path="/cadastro/cooperativa"
                  element={<Register type="cooperativa" />}
                />
                <Route
                  path="/editar"
                  element={<Navigate to="/edit/client" />}
                />
                <Route path="/edit/client" element={<Edit type="cliente" />} />
                <Route path="/planejamento" element={<PlanningList />} />
                <Route path="*" element={<Navigate to="/relatorios" />} />
              </>
            )}

            {isCooperative && (
              <>
                <Route path="/ponto-coleta" element={<CollectionPoint />} />
                <Route path="*" element={<Navigate to="/ponto-coleta" />} />
              </>
            )}

            {isClient && (
              <>
                <Route
                  path="/dashboard-client"
                  element={<Dashboard mode="client" />}
                />
                <Route path="*" element={<Navigate to="/relatorios" />} />
              </>
            )}
          </>
        )}
      </Route>
    </Routes>
  );
};

export default MainRoutes;
