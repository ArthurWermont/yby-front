import { Navigate, Route, Routes } from "react-router-dom";
import CollectionPoint from "../collection-point/collection-point";
import SignIn from "../login/signIn-admin";
import ResponsiveDrawerLayout from "../template/drawer";

import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import Dashboard from "../dashboard";
import Edit from "../edit";
import SignInClient from "../login/singin-client";
import PlanningList from "../plannings";
import Register from "../register";
import Reports from "../reports";

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
          <Route path="/" element={<Navigate to="/signIn" />} />
        </>
      )}

      {/* Protected Routes */}
      <Route element={<ResponsiveDrawerLayout />}>
        {currentUser && (
          <>
            {isAdmin && (
              <>
                <Route
                  path="/cadastro"
                  element={<Navigate to="/cadastro/cliente" />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
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
                <Route path="/relatorios" element={<Reports />} />
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
                <Route path="/relatorios" element={<Reports />} />
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
