import { Button, Flex, Image, useColorMode } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/user.atom"
import { Link } from "react-router-dom"
import { Home, User, MessageCircle  } from 'lucide-react'
import useLogout from "../hooks/useLogout"

const Header = () => {
  const Logout = useLogout()
  const {colorMode, toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom)
  return (
    <Flex justifyContent={'space-between'} mt={6} mb={'12'}>
      {user && (
        <Link to={'/'}>
        <Home size={24}/>
        </Link>
      )}
      <Image cursor={'pointer'} alt="logo" src={colorMode === 'dark' ? '/light-logo.svg': '/dark-logo.svg'} w={6} onClick={toggleColorMode} />
      {user && (
        <Flex alignItems={'center'} gap={4}>
          <Link to={`/user/${user.username}`}>
        <User size={24}/>
        </Link>
        <Link to={`/chat`}>
        <MessageCircle  size={24}/>
        </Link>
        <Button size={'sm'} onClick={Logout} >
        Logout
    </Button>
        </Flex>
        
        
      )}
    </Flex>
  )
}

export default Header
