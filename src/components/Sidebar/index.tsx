import { useState } from "react";
import nunito from "@/lib/fonts/nunito";
import Logo from "../Logo";
import SearchInput from "../SearchInput";
import styles from "./sidebar.module.css";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
interface SidebarProps {
    selectedMenu: string;
    setSelectedMenu: (menu: string) => void;
}
export default function Sidebar({ selectedMenu, setSelectedMenu }: SidebarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleMenuItemSelect = (menu: string) => {
        setSelectedMenu(menu);
        setIsSidebarOpen(false);
    };

    return (
        <>
            <button
                className={styles.hamburgerBtn}
                aria-label="Toggle menu"
                aria-expanded={isSidebarOpen}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
            </button>
            {isSidebarOpen && (
                <div
                    className={styles.backdrop}
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
            <nav
                className={`
          ${nunito.className} 
          ${styles.sidebar}
          ${isSidebarOpen ? styles.sidebarOpen : ""}
        `}
                role="navigation"
                tabIndex={-1}
            >
                <div className={styles.logoContainer}>
                    <Logo size={24} />
                </div>
                <SearchInput />
                <div className={styles.sidebarMenu}>
                    <p className={styles.menuTitle}>Recruitment</p>
                    <ul className={styles.sidebarMenuItemList}>
                        <li
                            className={`
                                ${styles.sidebarMenuItem}
                                `}
                            onClick={() => {
                                handleMenuItemSelect("Candidates");
                                router.push(`/dashboard/${session?.user?.id}/candidates`);
                            }}
                        >
                            <div
                                className={styles.selectorUI}
                                style={{ opacity: selectedMenu === "Candidates" ? 1 : 0 }}
                            ></div>
                            <Image src="/assets/add_user.png" width={15} height={13.33} alt="Candidates" />
                            <p className={styles.menuItemText}>Candidates</p>
                        </li>
                    </ul>
                </div>
                <div className={styles.sidebarMenu}>
                    <p className={styles.menuTitle}>Organization</p>
                    <ul className={styles.sidebarMenuItemList}>
                        <li
                            className={styles.sidebarMenuItem}
                            onClick={() => {
                                handleMenuItemSelect("Employees")
                                router.push(`/dashboard/${session?.user?.id}/employees`);
                            }}
                        >
                            <div
                                className={styles.selectorUI}
                                style={{ opacity: selectedMenu === "Employees" ? 1 : 0 }}
                            ></div>
                            <Image src="/assets/users.png" width={15} height={13.33} alt="Employees" />
                            <p className={styles.menuItemText}>Employees</p>
                        </li>
                        <li
                            className={styles.sidebarMenuItem}
                            onClick={() => handleMenuItemSelect("Attendance")}
                        >
                            <div
                                className={styles.selectorUI}
                                style={{ opacity: selectedMenu === "Attendance" ? 1 : 0 }}
                            ></div>
                            <Image src="/assets/network.png" width={15} height={13.33} alt="Attendance" />
                            <p className={styles.menuItemText}>Attendance</p>
                        </li>
                        <li
                            className={styles.sidebarMenuItem}
                            onClick={() => handleMenuItemSelect("Leaves")}
                        >
                            <div
                                className={styles.selectorUI}
                                style={{ opacity: selectedMenu === "Leaves" ? 1 : 0 }}
                            ></div>
                            <Image src="/assets/sparkle.png" width={15} height={13.33} alt="Leaves" />
                            <p className={styles.menuItemText}>Leaves</p>
                        </li>
                    </ul>
                </div>
                <div className={styles.sidebarMenu}>
                    <p className={styles.menuTitle}>Others</p>
                    <ul className={styles.sidebarMenuItemList}>
                        <li className={styles.sidebarMenuItem}>
                            <div className={styles.selectorUI} style={{ opacity: 0 }}></div>
                            <Image src="/assets/logout.png" width={15} height={13.33} alt="Logout" />
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className={styles.logoutBtn}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
