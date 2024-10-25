import { Container } from "@chakra-ui/react"
import { Navigate,Route, Routes } from "react-router"
import UserPage from "./Pages/UserPage.jsx"
import PostPage from "./Pages/PostPage.jsx"
import Header from "./Components/Myheader.jsx"
import AuthPage from "./Pages/AuthPage.jsx"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/user.atom.js"
import Homepage from "./Pages/Homepage.jsx"
import LogoutButton from "./Components/LogoutButton.jsx"
import UpdateProfilePage from "./Pages/UpdateProfilePage.jsx"
import CreatePost from "./Components/CreatePost.jsx"
import LoginButton from "./Components/LoginButton.jsx"
const App = () => {
  const user = useRecoilValue(userAtom)
  return (
    <Container>
      <Header/>
      <Routes>
  <Route path="/" element={user ? <Homepage /> : <Navigate to='/auth' />} />
  <Route path="/auth" element={!user ? <AuthPage /> :  <Navigate to="/" />} />
  <Route path="/user/:username" element={<UserPage />} />
  <Route path="/user/:username/post/:pid" element={<PostPage />} />
  <Route path="/update" element={ user ? <UpdateProfilePage /> : <Navigate to='/auth'/>} />
  {/* Catch-all route */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

    {user && (
      <LogoutButton />
    )}
        {user && (
      <CreatePost />
    )}
    {!user && (
      <LoginButton />
    )}
    </Container>
  )
}

export default App

