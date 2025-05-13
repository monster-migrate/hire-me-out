import styles from "../datatable.module.css";

interface TableHeaderProps {
  columns: string[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
  return (
    <div className={styles.dataTableHeader}>
      {columns.map((column, idx) => (
        <div key={idx} style={{ textAlign: "center" }}>
          {column}
        </div>
      ))}
    </div>
  );
}
