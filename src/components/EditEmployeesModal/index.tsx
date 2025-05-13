import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OverlayShadow from "../OverlayShadow";
import EditForm from "../EditForm";

interface EditEmployeesFormSchema {
    fullname: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    DateOfJoining: string;
}

export default function EditEmployeesModal(
    { candidateId,
        openModal,
        setOpenModal
    }: {
        candidateId: string,
        openModal: boolean,
        setOpenModal: (open: boolean) => void;
    }) {
    const [data, setData] = useState<EditEmployeesFormSchema>();
    const { data: session } = useSession();
    useEffect(() => {
        const fetchData = async () => {
            const query = `
            query GetCandidateByID($getCandidateByIdId: ID!, $hrManagerId: ID!) {
                getCandidateByID(id: $getCandidateByIdId, hrManagerId: $hrManagerId) {
                    name
                    email
                    phone
                    Department
                    position
                    DateOfJoining
                }
            }
            `;
            const variables = {
                getCandidateByIdId: candidateId,
                hrManagerId: session?.user?.id
            }
            const res = await fetch("/api/graphql", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, variables })
            });
            const result = await res.json();
            const candidate = result?.data?.getCandidateByID;
            if (candidate) {
                setData({
                    fullname: candidate.name,
                    email: candidate.email,
                    phone: candidate.phone,
                    department: candidate.Department,
                    position: candidate.position,
                    DateOfJoining: candidate.DateOfJoining
                });
            }
        };
        if (openModal && session?.user?.id) {
            fetchData();
        }
    }, [openModal, session?.user?.id, candidateId])
    const initialValues = {
        fullname: data?.fullname,
        email: data?.email,
        phone: data?.phone,
        department: data?.department,
        position: data?.position,
        DateOfJoining: data?.DateOfJoining?.slice(0, 10),
    }
    return (
        <div>
            <OverlayShadow isOpen={openModal} setIsOpen={setOpenModal}>
                <EditForm
                    setIsOpen={setOpenModal}
                    onSubmit={() => { }}
                    initialValues={initialValues}
                />
            </OverlayShadow>
        </div>
    );
}