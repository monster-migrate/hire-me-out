import styles from "./infographic.module.css";
import Image from "next/image";
export default function Infographic() {
    return (
        <div className={styles.formInfographic}>
            <Image src="/assets/infographic.png" width={520} height={284} alt="inffographic" />
            <p className={`${styles.brandHeading}`}>
                Showcase Your Skills. Get Noticed. And we will Hire You Out.
            </p>
            <p className={`${styles.brandDescription}`}>
                Join our platform to connect with recruiters actively
                seeking talented professionals. Create your profile,
                highlight your strengths, and open doors to new career
                opportunities — all in one place.</p>
        </div>
    )
}