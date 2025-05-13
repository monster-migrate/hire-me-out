import { FaChevronDown } from "react-icons/fa6";
import styles from "./dropdown.module.css"
import nunito from "@/lib/fonts/nunito";
import { CSSProperties, ReactNode, useState } from "react";
export default function Dropdown({
    heading,
    values,
    style,
    onClick
}: {
    heading: ReactNode;
    values: string[];
    style?: CSSProperties;
    onClick: (e: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`${nunito.className} ${styles.scrollContainer}`}>
            <div
                className={`${styles.dropdown}`}
                onClick={() => setIsOpen(!isOpen)}
                style={style}>
                <p>{heading}</p>
                <FaChevronDown style={{
                    transform: isOpen ? "rotate(180deg)" : "",
                }} />
            </div>
            <ul className={styles.valuesContainer}
                style={{
                    display: isOpen ? "block" : "none",
                }}>
                {Object.values(values).map((item, idx) => (
                    <li className={styles.dropdownItem}
                        key={idx}
                        onClick={() => { onClick(item) }}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}