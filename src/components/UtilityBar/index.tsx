import { Position, Status } from "../../../mongoose/Candidates/candidates.interface";
import Dropdown from "../Dropdown";
import Modal from "../Modal";
import SearchInput from "../SearchInput";
import styles from "./utilitybar.module.css";
export default function UtilityBar({
    filterByStatus,
    setFilterByStatus,
    filterByPosition,
    setFilterByPosition,
    hasSearch = true,
    hasModal = true
}: {
    filterByStatus?: Status;
    setFilterByStatus?: (status: Status | "") => void;
    filterByPosition?: Position;
    setFilterByPosition?: (position: Position | "") => void;
    hasSearch?: boolean,
    hasModal?: boolean
}) {
    return (
        <div className={styles.container}>
            <div className={styles.filterContainer}>
                {setFilterByStatus && <div>
                    <Dropdown
                        heading={filterByStatus ? filterByStatus : "Status"}
                        values={Object.values(Status)}
                        onClick={(item) => {
                            if (setFilterByStatus) setFilterByStatus(item as Status)
                        }}
                    />
                </div>}
                {setFilterByPosition && <div>
                    <Dropdown heading={filterByPosition ? filterByPosition : "Position"}
                        values={Object.values(Position)}
                        onClick={(item) => {
                            if (setFilterByPosition) setFilterByPosition(item as Position)
                        }} />

                </div>}
            </div>
            <div className={styles.utilContainer}>
                {hasSearch && <SearchInput />}
                {hasModal && <Modal text="Add Candidate" />}
            </div>
        </div>
    );
}