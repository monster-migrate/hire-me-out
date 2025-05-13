import { useState } from "react";
import Button from "../Button";
import OverlayShadow from "../OverlayShadow";
import Form, { FormField } from "../Form";
import { useSession } from "next-auth/react";


export default function Modal({
    text
}: {
    text: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const formFields = [
        {
            name: "fullname",
            label: "Fullname",
            type: "text",
            required: true,
            placeholder: "Fullname",
        },
        {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
            placeholder: "john@example.com",
        },
        {
            name: "phone",
            label: "Phone Number",
            type: "text",
            required: true,
            placeholder: "john@example.com",
        },
        {
            name: "position",
            label: "Position",
            type: "select",
            required: true,
            options: [
                { label: "Designer", value: "DESIGNER" },
                { label: "Developer", value: "DEVELOPER" },
                { label: "Human Resource", value: "HUMAN_RESOURCE" },
            ],
        },
        {
            name: "experience",
            label: "Experience",
            type: "number",
            required: true,
        },
        {
            name: "resume",
            label: "Resume",
            type: "file",
            required: true,
        },
        {
            name: "checkbox",
            label: "I hereby declare that the above information is true to the best of my knowledge and belief",
            type: "checkbox",
            required: true,
        }
    ];
    return (
        <div>
            <Button text={text} style="primary" onClick={() => { setIsOpen(true) }} />
            <OverlayShadow isOpen={isOpen} setIsOpen={setIsOpen}>
                <Form
                    setIsOpen={setIsOpen}
                    formHeading="Register"
                    formDescription="Please fill out the form below to register."
                    formFields={formFields as FormField[]}
                    onClick={async (data) => {
                        const createCandidateQuery = `
                        mutation CreateCandidate(
                        $name: String!, $email: String!, $countryCode: String!, 
                        $phone: String!, $position: String!, $department: String!,
                        $experience: Int!,
                        $dateOfJoining: GraphQLDate!, $hrManagerId: ID!) {
                            createCandidate(
                            name: $name, email: $email, countryCode: $countryCode, 
                            phone: $phone, position: $position, Department: $department, 
                            experience: $experience,
                            DateOfJoining: $dateOfJoining, hrManagerId: $hrManagerId) {
                                createdAt
                                id
                            }
                        }`;
                        const variables = {
                            name: data.fullname,
                            email: data.email,
                            countryCode: "+91",
                            phone: data.phone,
                            position: data.position,
                            department: "TBD",
                            experience: data.experience,
                            dateOfJoining: new Date("2025-05-12T00:00:00.000Z"),
                            hrManagerId: session?.user.id
                        }
                        const response = await fetch("/api/graphql", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${session?.user.token}`
                            },
                            credentials: "include",
                            body: JSON.stringify({ query: createCandidateQuery, variables: variables })
                        })
                        if (!response.ok) {
                            setIsOpen(true);
                            throw new Error("Failed to fetch data");
                        }
                        const result = await response.json();
                        if (result?.data?.createCandidate && data.resume) {
                            const formData = new FormData();
                            formData.append("candidateId", result.data.createCandidate.id);
                            formData.append("resume", data.resume); // make sure it's a File object

                            const uploadQuery = await fetch("/api/uploadresume", {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${session?.user.token}`
                                },
                                body: formData,
                            });
                            if (!uploadQuery.ok) {
                                setIsOpen(true);
                                console.log(uploadQuery)
                                throw new Error("Failed to upload resume");
                            } else {
                                setIsOpen(false);
                                console.log("uploaded")
                            }
                            setIsOpen(false);
                        }
                    }}
                />
            </OverlayShadow>
        </div>
    )
}