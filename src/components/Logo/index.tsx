import { FaRegSquare } from "react-icons/fa6";
import styles from "./logo.module.css";
export default function Logo() {
    return (
        <div className={`${styles.logo}`}>
            <FaRegSquare />
            Hire Me Out
        </div>
    )
}