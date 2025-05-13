import { getSession, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import styles from "@/styles/dashboard/dashboard.module.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useCallback, useEffect, useState } from "react";
import UtilityBar from "@/components/UtilityBar";
import DataTable from "@/components/DataTable";
import { Position, Status } from "../../../../mongoose/Candidates/candidates.interface";

export default function CandidatesDashboard() {
    const { data: session } = useSession({ required: true });
    const [selectedMenu, setSelectedMenu] = useState("Candidates");
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<Record<string, Status>>({});
    const [filterByStatus, setFilterByStatus] = useState<Status>();
    const [filterByPosition, setFilterByPosition] = useState<Position>();
    const userId = session?.user?.id;

    const fetchCandidates = useCallback(async () => {
        const candidatesQuery = `
    query GetCandidatesByHR($hrManagerId: ID!, $status: Status, $position: Position) {
      getCandidatesByHR(hrManagerId: $hrManagerId, status: $status, position: $position) {
        id
        name
        email
        phone
        position
        status
        experience
      }
    }
  `;
        const variables = { hrManagerId: session?.user?.id, status: filterByStatus, position: filterByPosition };

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
    }, [session?.user?.id, filterByStatus, filterByPosition]);

    useEffect(() => {
        if (userId) {
            fetchCandidates();
            setColumns(["Sr no.", "Name", "Email", "Phone", "Position", "Status", "Experience"]);
        }
    }, [userId, filterByStatus, filterByPosition, fetchCandidates]);
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
        if (response.ok) fetchCandidates();
    };

    const handleDownload = async (candidateId: string) => {
        const response = await fetch(`/api/candidates/${candidateId}/downloadresume`);
        if (!response.ok) {
            alert("Failed to download resume.");
            return;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        // Optionally, get filename from Content-Disposition header
        const disposition = response.headers.get("Content-Disposition");
        let filename = "resume.pdf";
        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/"/g, "");
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };
    const candidateActions = [
        { label: "Download Resume", action: handleDownload },
        { label: "Delete Candidate", action: handleDelete }
    ];

    return (
        <div className={styles.container}>
            <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
            <main className={styles.content}>
                <Navbar heading={selectedMenu} />
                <UtilityBar
                    filterByStatus={filterByStatus as Status}
                    setFilterByStatus={setFilterByStatus as (status: Status | "") => void}
                    filterByPosition={filterByPosition as Position}
                    setFilterByPosition={setFilterByPosition as (position: Position | "") => void}
                />
                <DataTable
                    actions={candidateActions}
                    columns={columns} data={data}
                    statuses={statuses}
                    setStatuses={setStatuses} />
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