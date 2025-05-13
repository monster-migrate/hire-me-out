import { useRouter } from "next/router";

export default function LeavesPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Leaves Page</h1>
      <p>Employee ID: {id}</p>
      {/* TODO */}
    </main>
  );
}
