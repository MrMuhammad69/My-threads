import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/message.atom"
import userAtom from "../atoms/user.atom"
import { BsCheck2All } from "react-icons/bs"
import { useState } from "react"


const Message = ({ownMessage, message}) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const user = useRecoilValue(userAtom)
    const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <>
    {ownMessage? (
        <Flex gap={2} alignSelf={ 'flex-end'}>
          {message.text && message.text !== "Sent an image" && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
            <Text color={"white"}>{message.text}</Text>
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen ? "blue.400" : ""}
              fontWeight={"bold"}
            >
              <BsCheck2All size={16} />
            </Box>
          </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={'200px'}>
            <Image src={message.img} alt='image' hidden borderRadius={4} onLoad={() => setImgLoaded(true)} />
            <Skeleton w={'200px'} h={'200px'}  />
          </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={'200px'}>
            <Image src={message.img} alt='image' borderRadius={4} onLoad={() => setImgLoaded(true)} />
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen ? "blue.400" : ""}
              fontWeight={"bold"}
            >
              <BsCheck2All size={16} />
            </Box>
          </Flex>
          )}
        
        <Avatar src={user.profilePic} w={7} h={7} />
    </Flex>
    ):(
        <Flex gap={2}>
            <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
            {message.text && message.text !== "Sent an image" && (  
                <Text maxW={'350px'} bg={'gray.400'}p={1} borderRadius={'md'}>
                    {message.text}
                </Text>
            )}
            {message.img && (
                <Flex mt={5} w={'200px'}>
                    <Image src={message.img} alt='image' borderRadius={4} />
                </Flex>
            )}
        </Flex>
    )}
    </>
    
  )
}

export default Message
 