import { Box, Container } from "@chakra-ui/react"
import { Navigate, Route, Routes, useParams } from "react-router"
import UserPage from "./Pages/UserPage.jsx"
import PostPage from "./Pages/PostPage.jsx"
import Header from "./Components/Myheader.jsx"
import AuthPage from "./Pages/AuthPage.jsx"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/user.atom.js"
import Homepage from "./Pages/Homepage.jsx"
import UpdateProfilePage from "./Pages/UpdateProfilePage.jsx"
import CreatePost from "./Components/CreatePost.jsx"
import LoginButton from "./Components/LoginButton.jsx"
import ChatPage from "./Components/ChatPage.jsx"
import { useLocation } from "react-router"
const App = () => {
  const user = useRecoilValue(userAtom)
  const currentUser = useRecoilValue(userAtom)
  const {pathname} = useLocation()
  return (
    <Box position={'relative'} w={'100%'}>
    <Container maxW={pathname === '/' ? {
      base:'620px',
      md:'900px'
    } : '620px'}>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Homepage /> : <Navigate to='/auth' />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        
        <Route path="/user/:username" element={<UserWithCreatePost currentUser={currentUser} />} />
        
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={ user ? <ChatPage /> : <Navigate to='/auth' />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {user ? (
        // Logout button only shown on medium and larger screens
        null
      ) : (
        <LoginButton />
      )}
    </Container>
    </Box>
  )
}

const UserWithCreatePost = ({ currentUser }) => {
  const { username } = useParams() // get username from URL

  return (
    <>
      <UserPage />
      {/* Show CreatePost only if the username in the URL matches the current user's username */}
      {currentUser && currentUser.username === username && <CreatePost />}
    </>
  )
}

export default App
