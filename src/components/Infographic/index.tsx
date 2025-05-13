import styles from "./infographic.module.css";
import Image from "next/image";
export default function Infographic() {
    return (
        <div className={styles.formInfographic}>
            <Image src="/assets/infographic.png" width={520} height={284} alt="infographic" />
            <p className={`${styles.brandHeading}`}>
                Discover Top Talent. Simplify Hiring. Hire Them Out.
            </p>
            <p className={`${styles.brandDescription}`}>
                Join our platform designed exclusively for HR professionals and
                recruiters. Manage candidate profiles, track hiring progress,
                and streamline your recruitment workflow — all from a single,
                secure dashboard.</p>
        </div>
    )
}