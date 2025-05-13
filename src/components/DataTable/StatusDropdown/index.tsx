import Dropdown from "@/components/Dropdown";
import { Status } from "../../../../mongoose/Candidates/candidates.interface";

export default function StatusDropdown({ currentStatus, onChange }: {
  currentStatus: Status;
  onChange: (value: string) => void;
}) {
  return (
    <Dropdown
      heading={currentStatus}
      values={Object.keys(Status)}
      onClick={async (value) => {
        console.log("Status changed to:", value);
        onChange(value);
      }}
    />
  );
}
