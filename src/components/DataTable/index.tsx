import nunito from "@/lib/fonts/nunito";
import styles from "./datatable.module.css";
import { Status } from "../../../mongoose/Candidates/candidates.interface";
import { useSession } from "next-auth/react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface ActionHandler {
  label: string;
  action: (candidateId: string) => Promise<void> | void;
}

interface DataTableProps {
  columns: string[];
  data: any[];
  statuses: Record<string, Status>;
  setStatuses: React.Dispatch<React.SetStateAction<Record<string, Status>>>;
  actions: ActionHandler[];
}

export default function DataTable({
  columns,
  data,
  statuses,
  setStatuses,
  actions
}: DataTableProps) {
  const { data: session } = useSession();

  async function handleStatusChange(candidateId: string, value: string) {
    const status = Status[value as keyof typeof Status];
    setStatuses((prev) => ({
      ...prev,
      [candidateId]: status,
    }));

    const query = `
      mutation UpdateCandidate($id: ID!, $hrManagerId: ID!, $status: Status) {
        updateCandidate(id: $id, hrManagerId: $hrManagerId, status: $status) {
          status
          name
        }
      }
    `;
    const variables = {
      id: candidateId,
      hrManagerId: session?.user.id,
      status,
    };
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });
      const data = await res.json();
      if (data.errors) {
        console.error(data.errors);
      }
    } catch (error) {
      console.error("Status update failed:", error);
    }
  }


  return (
    <div className={nunito.className}>
      <div className={styles.dataTable}>
        <TableHeader columns={[...columns, "Action"]} />
        <div className={styles.dataTableBody}>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row.id || index}
                row={row}
                index={index}
                columns={columns}
                status={statuses[row.id]}
                onStatusChange={(value) => handleStatusChange(row.id, value)}
                actions={actions}
              />
            ))
          ) : (
            <div className={styles.dataTableRow}>
              <div
                style={{
                  gridColumn: `span ${columns.length + 1}`,
                  textAlign: "center",
                }}
              >
                No data available.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
