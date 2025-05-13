import styles from "../inputs.module.css";

export default function TextareaInput(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={styles.input} />;
}
