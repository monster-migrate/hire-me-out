import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import styles from "@/styles/dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useCallback, useEffect, useState } from "react";
import UtilityBar from "@/components/UtilityBar";
import DataTable from "@/components/DataTable";
import { Position, Status } from "../../../../mongoose/Candidates/candidates.interface";
import EditEmployeesModal from "@/components/EditEmployeesModal";

export default function EmployeesDashboard() {
    const { data: session } = useSession({ required: true });
    const [selectedMenu, setSelectedMenu] = useState("Candidates");
    const [openModal, setOpenModal] = useState(false);
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [candidateId, setCandidateId] = useState<string>();
    const [statuses, setStatuses] = useState<Record<string, Status>>({});
    const [filterByPosition, setFilterByPosition] = useState<Position>();
    const fetchEmployees = useCallback(async () => {

        const candidatesQuery = `
    query GetCandidatesByHR($hrManagerId: ID!, $status: Status, $position: Position) {
      getCandidatesByHR(hrManagerId: $hrManagerId, status: $status, position: $position) {
        id
        image
        name
        email
        phone
        position
        Department
        DateOfJoining
      }
    }
  `;
        const variables = { hrManagerId: session?.user?.id, status: Status.SELECTED, position: filterByPosition };

        try {
            const res = await fetch("/api/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: candidatesQuery, variables }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch data");
            }

            const result = await res.json();
            console.log("API Response:", result);
            if (result?.data?.getCandidatesByHR) {
                const initialStatuses: Record<string, Status> = {};
                result.data.getCandidatesByHR.forEach((c: any) => {
                    initialStatuses[c.id] = c.status;
                });
                setStatuses(initialStatuses);
                setData(result.data.getCandidatesByHR);
            } else {
                console.error("No candidates found or error in response", result);
            }
        } catch (err: any) {
            console.log("Error fetching candidates: " + err.message);
        }
    },[session?.user?.id, filterByPosition]);
    useEffect(() => {
        if (session?.user?.id) {
            fetchEmployees();
            setColumns(["Profile", "Name", "Email", "Phone", "Position", "Department", "Date Of Joining"])
        }
    }, [session?.user?.id, filterByPosition, fetchEmployees]);
    const handleDelete = async (candidateId: string) => {
        const response = await fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
              mutation DeleteCandidate($id: ID!, $hrManagerId: ID!) {
                deleteCandidate(id: $id, hrManagerId: $hrManagerId)
              }
            `,
                variables: {
                    id: candidateId,
                    hrManagerId: session?.user.id
                }
            })
        });
        if (response.ok) fetchEmployees();
    };

    const handleEdit = async (candidateId: string) => {
        setCandidateId(candidateId)
        setOpenModal(true);
    };
    const candidateActions = [
        { label: "Edit", action: handleEdit },
        { label: "Delete", action: handleDelete }
    ];
    return (
        <div className={styles.container}>
            <Sidebar selectedMenu={selectedMenu || "Employees"} setSelectedMenu={setSelectedMenu} />
            <main className={styles.content}>
                <Navbar heading="Employees" />
                <UtilityBar
                    hasModal={false}
                    filterByPosition={filterByPosition as Position}
                    setFilterByPosition={setFilterByPosition as (position: Position | "") => void}
                />
                <DataTable
                    actions={candidateActions}
                    columns={columns} data={data}
                    statuses={statuses}
                    setStatuses={setStatuses} />
                {openModal && <EditEmployeesModal
                    candidateId={candidateId ? candidateId : ""}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />}
            </main>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params!;

    if (!session || session.user?.id !== id) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: {
                id: session.user?.id,
                name: session.user?.name,
                email: session.user?.email,
            },
        },
    };
};