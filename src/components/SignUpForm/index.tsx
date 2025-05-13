import { useState } from "react";
import SignUpSchema from "../zodSchemata/SignUpSchema";
import SignUpErrors from "@/lib/types/SignUpErrors";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signup.module.css";
import PasswordInput from "../PasswordInput";
export default function SignUpForm() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<SignUpErrors>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = SignUpSchema.safeParse({ fullname, email, password, confirmPassword });

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
        const signupMutation = `
        mutation CreateUser($name: String!, $email: String!, $password: String!) {
            createUser(name: $name, email: $email, password: $password) {
                email
                id
                name
            }
        }
        `;
        const variables = {
            name: fullname,
            email: email,
            password: password
        };
        const response = await fetch('/api/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: signupMutation, variables })
        });
        const data = await response.json();
        if (data.errors) {
            const graphqlErrors = data.errors[0]?.extensions?.exception?.errors;
            if (graphqlErrors && typeof graphqlErrors === 'object') {
                setError(graphqlErrors as SignUpErrors);
            } else {
                setError({ form: 'An unexpected error occurred. Please try again.' });
            }

            setLoading(false);
            return;
        }
        router.push('/auth/signin');
    };
    return (
        <div className={`${styles.formContent}`}>
            <form onSubmit={handleSubmit}>
                <div className={`${styles.form}`}>
                    <h2 className={`${styles.formHeading}`}>Welcome to Hire Me Out!</h2>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                            Full Name
                            <span style={{
                                color: 'var(--red)',
                            }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            className={`${styles.input}`}
                            placeholder="Full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <div className={`${styles.formErrorContainer}`}>
                            <p className={styles.formError}>
                                {error?.fullname ?? '\u00A0'}
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                            email
                            <span style={{
                                color: 'var(--red)',
                            }}>*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`${styles.input}`}
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className={styles.formError}>
                            {error?.email ?? '\u00A0'}
                        </p>
                    </div>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                            Password
                            <span style={{
                                color: 'var(--red)',
                            }}>*</span>
                        </label>
                        <PasswordInput password={password} setPassword={setPassword} placeholder="Password" />
                        <p className={styles.formError}>
                            {error?.password ?? '\u00A0'}
                        </p>
                    </div>
                    <div className={`${styles.inputContainer}`}>
                        <label className={`${styles.inputLabel}`}>
                            Retype Password
                            <span style={{
                                color: 'var(--red)',
                            }}>*</span>
                        </label>
                        <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} placeholder="Confirm Password" />
                        <p className={styles.formError}>
                            {error?.confirmPassword ?? '\u00A0'}
                        </p>
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
                            {loading ? <div className={styles.loader}>Please wait...</div> : "Register"}
                        </button>
                        <p style={{
                            color: 'var(--dark-grey)',
                        }}>
                            Already have an account?
                            {" "}
                            <Link
                                href="/auth/signin"
                                style={{
                                    color: 'var(--violet)',
                                    textDecoration: 'none',
                                    fontWeight: "600"
                                }}
                            >
                                Login
                            </Link></p>
                    </div>
                </div>
            </form>
        </div>
    );
}