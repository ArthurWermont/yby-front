import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import type { TableData } from "./interfaces";

type Props = {
  rowData: TableData;
  onEdit: (row: TableData) => void;
  onDelete: (row: TableData) => void;
  onViewImage: (row: TableData) => void;
  isClient: Boolean;
};

export const TableActions = ({
  rowData,
  onEdit,
  onDelete,
  onViewImage,
  isClient,
}: Props) => {
  return (
    <>
      {!isClient ? (
        <>
          <IconButton onClick={() => onEdit(rowData)}>
            <EditIcon style={{ color: "#9B9794" }} />
          </IconButton>
          <IconButton onClick={() => onDelete(rowData)}>
            <DeleteIcon style={{ color: "#9B9794" }} />
          </IconButton>
          <IconButton onClick={() => onViewImage(rowData)}>
            <ImageIcon style={{ color: "#9B9794" }} />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={() => onViewImage(rowData)}>
          <ImageIcon style={{ color: "#9B9794" }} />
        </IconButton>
      )}
    </>
  );
};
