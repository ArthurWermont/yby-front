import { DashboardProvider } from "./context";
import DashAdmin from "./dashboard-adm";
import DashClient from "./dashboard-client";

export default function Dashboard(props: { mode: "client" | "admin" | "manager"}) {
  return (
    <DashboardProvider mode={props.mode}>
      {props.mode === "client" ? <DashClient /> : <DashAdmin />}
    </DashboardProvider>
  );
}