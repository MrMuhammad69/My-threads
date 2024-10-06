import LoginCard from "../Components/LoginCard.jsx"
import SignupCard from "../Components/SignupCard.jsx" // Correct import
import authScreenAtom from "../atoms/auth.atom.js"
import { useRecoilValue } from "recoil"

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)

    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    )
}

export default AuthPage
