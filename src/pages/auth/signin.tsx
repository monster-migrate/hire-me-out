// pages/signin.tsx

import {  useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SignInComponent from "@/components/SignIn";
export default function SignIn() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || !session.user?.id) return;
        router.push(`/dashboard/${session.user.id}`);
    }, [session, router]);

    return (
        <div>
            <SignInComponent />
        </div>
    );
}
