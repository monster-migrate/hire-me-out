import nunito from "@/lib/fonts/nunito"
import Infographic from "../Infographic"
import Logo from "../Logo"
import styles from "./signin.module.css"
import SignInForm from "../SignInForm"
export default function SignInComponent() {
    return (
        <div className={`${nunito.className} ${styles.container}`}>
            <Logo size={24}/>
            <div className={`${styles.formContainer}`}>
                <Infographic />
                <SignInForm />
            </div>
        </div>
    )
}