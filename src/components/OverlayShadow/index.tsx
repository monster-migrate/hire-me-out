import styles from "./overlayshadow.module.css"
// import { GiTireIronCross } from "react-icons/gi"

interface OverlayShadowProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    children: React.ReactNode;
}
export default function OverlayShadow({ isOpen, children }: OverlayShadowProps) {
    return (
        <div className={styles.overlayShadow} style={{
            display: isOpen ? 'block' : 'none',
        }}>
            {/* <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: "var(--white)",
                cursor: "pointer"
            }}>
                <GiTireIronCross size={32} />
            </div> */}
            <div style={{
                position: 'absolute',
                top: "50%",
                left: "50%",
                transform: "translate(-30%, -50%)",
                opacity: 1,
            }}>
                {children}
            </div>
        </div >
    )
}