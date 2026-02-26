import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import type { TableData } from "./interfaces";

type Props = {
  rowData: TableData;
  onEdit: (open: boolean, row?: TableData) => void;
  onDelete: (open: boolean, row?: TableData) => void;
  onViewImage: (open: boolean, row?: TableData) => void;
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
          <IconButton onClick={() => onEdit(true, rowData)}>
            <EditIcon style={{ color: "#9B9794" }} />
          </IconButton>
          <IconButton onClick={() => onDelete(true, rowData)}>
            <DeleteIcon style={{ color: "#9B9794" }} />
          </IconButton>
          <IconButton onClick={() => onViewImage(true, rowData)}>
            <ImageIcon style={{ color: "#9B9794" }} />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={() => onViewImage(true, rowData)}>
          <ImageIcon style={{ color: "#9B9794" }} />
        </IconButton>
      )}
    </>
  );
};
