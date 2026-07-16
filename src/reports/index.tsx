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
import api from "../api/api";

const Report = () => {
  const { search, onForm, onImage, onDelete } = useReportsContext();
  const { user: currentUser } = useContext(AuthContext);
  const isAdmin = !!currentUser?.isAdmin;
  const isManager = !!currentUser?.isManager;
  const isClient = !!currentUser?.client_id;

  const getCollectionItems = (collection: any) => {
    if (Array.isArray(collection?.items) && collection.items.length > 0) {
      return collection.items
        .slice()
        .sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
    }

    return [];
  };

  const getWasteNames = (collection: any) => {
    const items = getCollectionItems(collection);

    if (items.length > 0) {
      return items
        .map((item: any) => item?.waste_name)
        .filter(Boolean)
        .join(", ");
    }

    return collection?.wastes?.map((item: any) => item.name).join(", ") || "";
  };

  const getWasteIds = (collection: any) => {
    const items = getCollectionItems(collection);

    if (items.length > 0) {
      return items
        .map((item: any) => item?.waste_id || item?.waste?.id)
        .filter(Boolean)
        .map(String);
    }

    return collection?.wastes?.map((item: any) => String(item.id)) || [];
  };

  const getStrapiMediaUrl = (url?: string) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    const baseUrl = String(api.defaults.baseURL || "").replace(/\/api\/?$/, "");

    return `${baseUrl}${url}`;
  };

  const getItemImages = (collection: any) => {
    const items = getCollectionItems(collection);

    return items.map((item: any, index: number) => ({
      order: item.order || index + 1,
      wasteName: item?.waste_name || `Item ${index + 1}`,
      weightKg: item?.weight_kg,
      originalQuantity: item?.original_quantity,
      originalUnit: item?.original_unit,
      collectorVolumeBreakdown: item?.collector_volume_breakdown,
      imageColector: getStrapiMediaUrl(item?.colector?.url || ""),
    }));
  };

  const fetchData = useCallback(
    async ({ page }: { page: number }) => {
      const { data: reportData, meta } = await reportService.getData({
        documentId: isClient ? currentUser?.client_id || "" : "",
        isAdmin,
        isManager,
        managerClientIds: isManager
          ? (currentUser?.manager?.clients ?? [])
              .map((client) => client.documentId)
              .filter((id): id is string => !!id)
          : [],
        page,
        limit: 100,
        search,
      });

      return {
        data: parseTableData(reportData),
        pagination: meta.pagination,
      };
    },
    [search, currentUser, isClient, isAdmin, isManager],
  );

  const parseTableData = (data: any[] = []) => {
    return data.map((collection: any) => {
      const items = getCollectionItems(collection);
      const wastes = getWasteNames(collection);
      const wastesIds = getWasteIds(collection);
      const itemImages = getItemImages(collection);

      const formattedCollection: TableData = {
        id: collection.id || "",
        documentId: collection.documentId,

        pev: collection?.client?.social_name || "",

        waste: wastes || "",
        wastesIds: wastesIds || [],

        weight: collection?.weight || "",

        cooperative: collection?.cooperative?.cooperative_name || "",

        imageAvaria: getStrapiMediaUrl(collection?.breakdown?.url || ""),
        imageColectorUrl:
          itemImages.find((item: any) => item.imageColector)?.imageColector ||
          getStrapiMediaUrl(collection.colector?.url || ""),
        itemImages,
        items,
        hasAvaria: Boolean(collection?.breakdown?.url) ? "Sim" : "Não",

        collection_date:
          format(collection?.collection_date, "dd/MM/yyyy | HH:mm") || "",

        actions: null,
      } as TableData;

      formattedCollection.actions = (
        <TableActions
          rowData={formattedCollection}
          onEdit={onForm}
          onDelete={onDelete}
          onViewImage={onImage}
          isClient={isClient || isManager}
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
