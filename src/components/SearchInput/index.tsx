import Image from "next/image";
import styles from "./searchinput.module.css"
export default function SearchInput() {
    return (
        <div className={styles.container}>
            <Image src="/assets/search.png"
                width={16} height={16} alt="search"
                className={styles.searchIcon} />
            <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
            />
        </div>
    );
}