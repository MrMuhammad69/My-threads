import { Flex, Image, useColorMode } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/user.atom"
import { Link } from "react-router-dom"
import { Home, User } from 'lucide-react'

const Header = () => {
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
        <Link to={`/user/${user.username}`}>
        <User size={24}/>
        </Link>
      )}
    </Flex>
  )
}

export default Header
