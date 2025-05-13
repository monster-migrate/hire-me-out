import { useState } from "react";
import styles from "../inputs.module.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    val?: string;
}


export default function TextInput({ label, val, ...props }: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className={styles.inputWrapper}>
            <input
                {...props}
                placeholder=""
                value={val}
                className={`${styles.input} ${isFocused || props.value ? styles.focused : ""}`}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => setIsFocused(!!e.target.value)}
            />
            <label className={styles.label}>{label}</label>
        </div>
    );
}