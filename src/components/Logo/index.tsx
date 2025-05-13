import { FaRegSquare } from "react-icons/fa6";
import styles from "./logo.module.css";
export default function Logo({ size }: { size: number }) {
    return (
        <div className={`${styles.logo}`}
            style={{
                fontSize: size
            }}>
            <FaRegSquare />
            <p>Hire Me Out</p>
        </div>
    )
}