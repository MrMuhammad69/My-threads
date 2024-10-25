import { Avatar, Flex, Image, Text, Box, Divider, Button } from "@chakra-ui/react"
import { MoreHorizontal } from "lucide-react"
import Actions from "../Components/Actions"
import { useState } from "react"
import Comment from "../Components/Comment"


const PostPage = () => {
  const [liked, setLiked] = useState(false)
  return (
    <>
        <Flex>
          <Flex w={'full'} alignItems={'center'} gap={3}>
      <Avatar  src="/zuck-avatar.png" size={'md'} name="Mark Zuckerberg"/>
      <Flex>
        <Text fontSize={'sm'} fontWeight={'bold'}>markzuckerberg
        </Text>
        <Image src="/verified.png" w={4} h={4} ml={4} />
      </Flex>

    </Flex>
    <Flex gap={4} alignItems={'center'}>
      <Text fontSize={'sm'} color={'gray.light'}>
        1d
      </Text>
      <MoreHorizontal size={15} />

    </Flex>
    </Flex>
    <Text my={3}>
      Let's talk about Threads 
    </Text>
    <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={"gray.light"}>
                        {<Image src={'/post1.png'} w={'full'} />}
                    </Box>
    <Flex gap={3} my={3}>
      <Actions  liked={liked} setLiked={setLiked}/>
    </Flex>
    <Flex gap={2} alignItems={'center'}>
      <Text color={'gray.light'} fontSize={'sm'}>
        238 replies
      </Text>
      <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}>      </Box>
      <Text color={'gray.light'} fontSize={'sm'}>
        {200 + (liked ? 1 :0)} replies
      </Text>


    </Flex>
    <Divider  my={4} />
    <Flex justifyContent={'space-between'}>
      <Flex gap={2} alignItems={'center'}>
        <Text fontSize={'2xl'}>👏</Text>
        <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
      </Flex>
      <Button>
        Get
      </Button>

    </Flex>
    <Divider my={4} />
    <Comment comment='looks perfect' createdAt='2d' avatar='https://bit.ly/kent-c-dodds' username='jhondoe' likes={123}/>
    <Comment comment='incredible' createdAt='2d' avatar='https://bit.ly/tioluwani-kolawole' username='viratKohli' likes={37}/>
    <Comment comment='Cant beleive what i have just seen 😊' createdAt='2d' avatar='https://bit.ly/ryan-florence' username='daryllmitchell' likes={2}/>

    </>


  )
}

export default PostPage
