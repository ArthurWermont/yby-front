import moment from "moment";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import type { TableData } from "./table/interfaces";

export interface IContext {
  search: {
    pev: string;
    startDate: string;
    endDate: string;
    waste: string;
    sortByDate: "asc" | "desc";
  };

  modalDelete: boolean;
  modalForm: boolean;
  modalImage: boolean;
  selectedRow: TableData | null | undefined;

  onForm: (open: boolean, row?: TableData) => void;
  onImage: (open: boolean, row?: TableData) => void;
  onDelete: (open: boolean, row?: TableData) => void;
  setSelected: (row: TableData) => void;
  onSearchChange?: (search: IContext["search"]) => void;
}

const Context = createContext<IContext>({} as IContext);

export const useReportsContext = () => {
  try {
    return useContext(Context);
  } catch (error) {
    throw new Error("useReportsContext must be used within a ReportsProvider");
  }
};

export const ReportsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [search, setSearch] = useState<IContext["search"]>({
    pev: "",
    sortByDate: "desc",
    startDate: moment().subtract(6, "months").format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    waste: "",
  });

  const [modalForm, setOpenModalForm] = useState(false);
  const [modalImage, setOpenModalImage] = useState(false);
  const [modalDelete, setOpenModalDelete] = useState(false);

  const [selectedRow, setSelectedRow] = useState<TableData | null | undefined>(
    null,
  );

  const setSelected = (row?: TableData) => {
    setSelectedRow(row);
  };

  const onForm = useCallback((open: boolean, row?: TableData) => {
    setOpenModalForm(open);
    setSelected(row);
  }, []);

  const onImage = useCallback((open: boolean, row?: TableData) => {
    setOpenModalImage(open);
    setSelected(row);
  }, []);

  const onDelete = useCallback((open: boolean, row?: TableData) => {
    setOpenModalDelete(open);
    setSelected(row);
  }, []);

  const handleSearchChange = (newSearch: IContext["search"]) => {
    setSearch(newSearch);
  };

  return (
    <Context.Provider
      value={{
        search,
        modalForm,
        modalImage,
        modalDelete,
        selectedRow,
        onForm,
        onImage,
        onDelete,
        setSelected,
        onSearchChange: handleSearchChange,
      }}
    >
      {children}
    </Context.Provider>
  );
};
