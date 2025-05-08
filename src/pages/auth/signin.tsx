// pages/signin.tsx

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignInSchema from "@/components/zodSchemata/SignInSchema";
import { FaHireAHelper } from "react-icons/fa6";
import styles from "@/styles/auth/signin.module.css";
export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [authenticated, setAuthenticated] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!authenticated) return;
        if (!session || !session.user?.id) return;
        router.push(`/dashboard/${session.user.id}`);
    }, [authenticated, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = SignInSchema.safeParse({ email, password });
        
        if (!result.success) {
          const firstError = result.error.errors[0];
          setError(firstError.message);
          return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/dashboard"
        });

        if (res?.error) {
            setError("Invalid email or password");
        } else if (res?.ok) {
            setAuthenticated(true);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FaHireAHelper />
                <h2>Sign In</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
