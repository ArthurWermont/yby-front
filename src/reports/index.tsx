import { format } from "date-fns";
import { useCallback, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { reportService } from "../services/Report.service";
import { useReportsContext } from "./context";
import { Header } from "./header";
import { Modals } from "./modals";
import { Styles } from "./styles";
import { ReportTable } from "./table";
import { TableActions } from "./table/actions";
import type { TableData } from "./table/interfaces";

const Report = () => {
  const { search, onForm, onImage, onDelete } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);
  const isClient = !!currentUser?.client_id;

  const fetchData = useCallback(async ({ page }: { page: number }) => {
    const { data: reportData, meta } = await reportService.getData({
      documentId: currentUser?.client_id,
      isAdmin: !isClient,
      page,
      limit: 100,
      search,
    });

    return {
      data: parseTableData(reportData),
      pagination: meta.pagination,
    };
  }, [search, currentUser, isClient]);

  const parseTableData = (data: any[] = []) => {
    return data.map((collection: any) => {
      const wastes =
        collection?.wastes.map((item: any) => item.name).join(", ") || "";
      const wastesIds = collection?.wastes.map((item: any) => item.id);

      const formattedCollection: TableData = {
        id: collection.id || "",
        documentId: collection.documentId,

        pev: collection?.client?.social_name || "",

        waste: wastes || "",
        wastesIds: wastesIds || [],

        weight: collection?.weight || "",

        cooperative: collection?.cooperative?.cooperative_name || "",

        imageAvaria: collection?.breakdown?.url || "",
        imageColectorUrl: collection.colector?.url || "",
        hasAvaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",

        createdAt: format(collection?.createdAt, "dd/MM/yyyy | HH:mm") || "",
      } as TableData;

      formattedCollection.actions = (
        <TableActions
          rowData={formattedCollection}
          onEdit={onForm}
          onDelete={onDelete}
          onViewImage={onImage}
          isClient={isClient}
        />
      );

      return formattedCollection;
    });
  };

  return (
    <>
      <Modals />
      <Styles>
        <Header />
        <ReportTable fetchData={fetchData} />
      </Styles>
    </>
  );
};

export default Report;
