import styles from "./button.module.css"
export default function Button({
    style,
    text,
    onClick,
}: {
    style?: string;
    text: string;
    onClick: () => void;
}) {
    return (
        <div>
            <button
                className={`${style ? styles[style] : ""} ${styles.button}`} onClick={onClick}>
                {text}
            </button>
        </div>
    )
}