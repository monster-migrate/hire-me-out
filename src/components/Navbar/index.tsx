import nunito from "@/lib/fonts/nunito"
import styles from "./navbar.module.css"
import Image from "next/image"
import { FaChevronDown } from "react-icons/fa6"
export default function Navbar({ heading }: { heading: string }) {
    return (
        <div className={`${nunito.className} ${styles.container}`}>
            <h2 className={styles.heading}>{heading}</h2>
            <div className={styles.navbarMenu}>
                <div>
                    <Image src="/assets/mail.png"
                        width={18} height={14} alt="messages" />
                </div>
                <div>
                    <Image src="/assets/bell.png"
                        width={18} height={18} alt="notifications" />
                </div>
                <div className={styles.profileMenu}>
                    <Image
                        src="/assets/default_image.png"
                        width={24} height={24} alt="profile menu"
                        className={styles.profileImage} />
                    <FaChevronDown style={{
                        color: "var(--violet)"
                    }} />
                </div>
            </div>
        </div>
    )
}