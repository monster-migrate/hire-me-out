import styles from "@/styles/auth/signup.module.css"
import nunito from "@/lib/fonts/nunito";
import Logo from "@/components/Logo";
import Infographic from "../Infographic";
import SignUpForm from "../SignUpForm";
export default function SignUp() {
    return (
        <div className={`${nunito.className} ${styles.container}`}>
            <Logo size={24}/>
            <div className={`${styles.formContainer}`}>
                <Infographic />
                <SignUpForm />
            </div>
        </div>
    )
}