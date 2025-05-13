import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SignInSchema from "@/components/zodSchemata/SignInSchema";
import styles from "./signin.module.css";
import PasswordInput from "@/components/PasswordInput";
import SignInErrors from "@/lib/types/SignInErrors";
import Link from "next/link";
export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<SignInErrors>({});
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id) {
            router.push(`/dashboard/${session.user.id}/candidates`);
        }
    }, [session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = SignInSchema.safeParse({ email, password });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path.length > 0) {
                    const field = err.path[0] as string;
                    fieldErrors[field] = err.message;
                } else {
                    fieldErrors["form"] = err.message; // general form error
                }
            });

            setError(fieldErrors);
            console.log(error);
            setLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/dashboard"
        });

        if (res?.error) {
            setError({ form: res.error == "CredentialsSignin" ?
                 "Invalid Credentials" : "Something went wrong" });
                 setLoading(false);
        } else if (res?.ok) {
            console.log("authenticated")
        }
    };

    return (
        <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmit}>
                <div className={`${styles.form}`}>
                    <h2 className={`${styles.formHeading}`}>Sign In</h2>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>Email</label>
                        <input
                            type="text"
                            name="email"
                            className={`${styles.input}`}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className={`${styles.formErrorContainer}`}>
                            <p className={styles.formError}>
                                {error?.email ?? '\u00A0'}
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>Password</label>
                        <PasswordInput password={password} setPassword={setPassword} placeholder="Password" />
                        <div className={`${styles.formErrorContainer}`}>
                            <p className={styles.formError}>
                                {error?.password ?? '\u00A0'}
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.formErrorContainer}`}>
                        <p className={styles.formError}>
                            {error?.form ?? '\u00A0'}
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}>
                        <button
                            className={`${styles.submitBtn}`}
                            type="submit">
                            {loading ? <div className={styles.loader}>Please wait...</div> : "Login"}
                        </button>
                        <p style={{
                            color: 'var(--dark-grey)',
                        }}>
                            Don&apos;t have an account?
                            {" "}
                            <Link
                                href="/"
                                style={{
                                    color: 'var(--violet)',
                                    textDecoration: 'none',
                                    fontWeight: "600"
                                }}
                            >
                                Register
                            </Link></p>
                    </div>
                </div>
            </form>
        </div>
    );

}