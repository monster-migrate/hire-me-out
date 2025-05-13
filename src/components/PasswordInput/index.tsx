import Image from "next/image";
import styles from "./password.module.css";
import { useState } from "react";
interface PasswordInputProps {
    password: string;
    setPassword: (value: string) => void;
    placeholder: string;
}
export default function PasswordInput({ password, setPassword, placeholder }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className={styles.container}>
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={styles.input}
                placeholder={placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Image 
            src={showPassword ? "/assets/eye.png" :"/assets/eye_disabled.png" }
            width={30} height={20} 
            alt="hide password"
            onClick={() => {
                setShowPassword(!showPassword);
            }}
            className={`${styles.eye}`}/>
        </div>
    );
}