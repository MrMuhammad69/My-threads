import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import Actions from "./Actions"


const Comment = ({avatar, createdAt, comment, username, likes}) => {
    const [liked, setLiked] = useState(false)
  return (
    <>
    <Flex gap={4} py={2} my={2} w='full'>
        <Avatar src={avatar} flexDirection={'column'}/>
        <Flex gap={1} w={'full'} flexDirection={'column'}>
            <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize={'sm'} fontWeight={'bold'}>{username}</Text>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'sm'} color={'gray.light'}>{createdAt}</Text>
                    <MoreHorizontal  size={15}/>
                </Flex>
            </Flex>
            <Text>
                {comment}
            </Text>
            <Actions liked={liked} setLiked={setLiked}/>
            <Text fontSize={'sm'}  color={'gray.light'}>
                {likes + (liked ? 1 : 0)} likes
            </Text>
        </Flex>
    </Flex>
    <Divider />
      
    </>
  )
}

export default Comment
