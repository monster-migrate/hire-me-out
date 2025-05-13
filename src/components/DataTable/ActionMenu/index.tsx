import Dropdown from "@/components/Dropdown";
import { HiDotsVertical } from "react-icons/hi";

interface ActionHandler {
  label: string;
  action: (candidateId: string) => Promise<void> | void;
}

interface ActionMenuProps {
  candidateId: string;
  actions: ActionHandler[];
}
export default function ActionMenu({ candidateId, actions }: ActionMenuProps) {
  return (
    <Dropdown
      heading={<HiDotsVertical />}
      values={actions.map(a => a.label)}
      style={{
        width: "16px",
        height: "16px",
        padding: "4px",
        border: "0px",
        borderRadius: "50px",
        cursor: "pointer",
      }}
      onClick={async (selectedLabel: string) => {
        const action = actions.find(a => a.label === selectedLabel);
        if (action) await action.action(candidateId);
      }}
    />
  );
}

// }

// export default function ActionMenu({ candidateId, refreshData }: ActionMenuProps) {
//   const { data: session } = useSession();
//   async function handleAction(action: string) {
//     if (action === "Download Resume") {
//       // Call the download API route
//       const response = await fetch(`/api/candidates/${candidateId}/downloadresume`);
//       if (!response.ok) {
//         alert("Failed to download resume.");
//         return;
//       }
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       // Optionally, get filename from Content-Disposition header
//       const disposition = response.headers.get("Content-Disposition");
//       let filename = "resume.pdf";
//       if (disposition && disposition.includes("filename=")) {
//         filename = disposition.split("filename=")[1].replace(/"/g, "");
//       }
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } else if (action === "Delete Candidate") {
//       const query = `
//       mutation DeleteCandidate($deleteCandidateId: ID!, $hrManagerId: ID!) {
//         deleteCandidate(id: $deleteCandidateId, hrManagerId: $hrManagerId)
//       }
//       `;
//       const variables = {
//         deleteCandidateId: candidateId,
//         hrManagerId: session?.user?.id,
//       };
//       try {
//         const response = await fetch("/api/graphql", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ query, variables })
//         });
//         if (response.ok) {
//           refreshData();
//         } else {
//           alert("Failed to delete candidate");
//         }
//       } catch (error: any) {
//         console.error("Delete error:", error);
//         alert("Error deleting candidate");
//       }
//     }
//   }

//   return (
//     <Dropdown
//       heading={<HiDotsVertical />}
//       values={["Download Resume", "Delete Candidate"]}
//       style={{
//         width: "16px",
//         height: "16px",
//         padding: "4px",
//         border: "0px",
//         borderRadius: "50px",
//         cursor: "pointer",
//         textAlign: "center"
//       }}
//       onClick={handleAction}
//     />
//   );
// }