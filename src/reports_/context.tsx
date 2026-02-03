import moment from "moment";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

export interface IContext {
  search: {
    pev: string;
    startDate: string;
    endDate: string;
    sortByDate: "asc" | "desc";
  };

  lastSearch: string | null;

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
    startDate: "",
    endDate: "",
  });

  const [lastSearch, setLastSearch] = useState<string | null>(null);

  const handleSearchChange = (newSearch: IContext["search"]) => {
    setLastSearch(moment().toISOString());
    setSearch(newSearch);
  };

  return (
    <Context.Provider
      value={{
        search,
        lastSearch,
        onSearchChange: handleSearchChange,
      }}
    >
      {children}
    </Context.Provider>
  );
};
