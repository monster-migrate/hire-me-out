import styles from "../inputs.module.css";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: string }[];
    val?: string
}

export default function SelectInput({ options,val, ...props }: SelectInputProps) {
    return (
        <select {...props} className={styles.input} value={val}>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}