import { format } from "date-fns";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { reportService } from "../services/Report.service";
import { useReportsContext } from "./context";
import { Header } from "./header";
import { Styles } from "./styles";
import { ReportTable } from "./table";
import type { TableData } from "./table/interfaces";

const Report = () => {
  const { search } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;

  const fetchData = async ({ page }: { page: number }) => {
    const { data: reportData, meta } = await reportService.getData({
      documentId: currentUser?.client_id,
      isAdmin: !isClient,
      page,
      limit: 5,
      search,
    });

    return {
      data: parseTableData(reportData),
      pagination: meta.pagination,
    };
  };

  const parseTableData = (data: any[] = []) => {
    return data.map((collection: any) => {
      const wastes =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";
      const wastesIds = collection?.wastes.map((item: any) => item.id);

      return {
        id: collection.id || "",
        documentId: collection.documentId,

        pev: collection?.client?.social_name || "",

        waste: wastes || "",
        wastesIds: wastesIds || [],

        weight: collection?.weight || "",

        cooperative: collection?.cooperative.cooperative_name || "",

        imageAvaria: collection?.breakdown?.url || "",
        imageColectorUrl: collection.colector?.url || "",
        hasAvaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",

        createdAt: format(collection?.createdAt, "dd/MM/yyyy | HH:mm") || "",

        actions: <></>,
      } as TableData;
    });
  };

  return (
    <Styles>
      <Header />
      <ReportTable fetchData={fetchData} />
    </Styles>
  );
};

export default Report;
