import styles from "../datatable.module.css";
import StatusDropdown from "../StatusDropdown";
import ActionMenu from "../ActionMenu";
import { Status } from "../../../../mongoose/Candidates/candidates.interface";

interface ActionHandler {
  label: string;
  action: (candidateId: string) => Promise<void> | void;
}

interface TableRowProps {
  row: any;
  index: number;
  columns: string[];
  status: Status;
  onStatusChange: (value: string) => void;
  actions: ActionHandler[];
}

export default function TableRow({
  row,
  index,
  columns,
  status,
  actions,
  onStatusChange,
}: TableRowProps) {
  console.log("ROW ID", row)
  return (
    <div className={styles.dataTableRow}>
      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
          }}
        >
          {renderCellContent(col, row, index, status, onStatusChange)}
        </div>
      ))}
      <ActionMenu candidateId={row.id} actions={actions}/>
    </div>
  );
}

function renderCellContent(
  col: string,
  row: any,
  index: number,
  status: Status,
  onStatusChange: (value: string) => void
) {
  if (col.toLowerCase().includes("sr no")) return index + 1;
  if (col.toLowerCase() === "status")
    return (
      <StatusDropdown currentStatus={status} onChange={onStatusChange} />
    );
  if (col.toLowerCase() === "date of joining") {
    const date = new Date(row["DateOfJoining"]).toLocaleDateString("en-GB");
    return date;
  }
  return row[col.toLowerCase()] ?? row[col] ?? "";
}
