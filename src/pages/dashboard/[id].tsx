import { getSession, signOut, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { NextPage } from "next";

interface User {
  id: string;
  name?: string;
  email?: string;
}

export default function Dashboard({ user }: { user: User }) {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const id = router.query.id as string | undefined;

  return (
    <div>
      <h2>Welcome to dashboard, {user.name || "User"}!</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>

      <button onClick={() => signOut({ callbackUrl: "/" })}>
        Sign Out
      </button>
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