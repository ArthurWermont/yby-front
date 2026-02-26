import { DashboardProvider } from "./context";
import DashAdmin from "./dashboard-adm";
import DashClient from "./dashboard-client";

export default function Dashboard(props: { mode: "client" | "admin" }) {
  return (
    <DashboardProvider mode={props.mode}>
      {props.mode === "client" ? <DashClient /> : <DashAdmin />}
    </DashboardProvider>
  );
}