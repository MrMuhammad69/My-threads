import { Avatar, Flex, Image, Text, Box, Divider, Button, Spinner } from "@chakra-ui/react"
import { Delete } from "lucide-react"
import Actions from "../Components/Actions"
import { useEffect } from "react"
import useShowToast from "../hooks/useShowToast"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useNavigate, useParams } from "react-router"
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/user.atom"
import Comment from "../components/Comment";
import postsAtom from "../atoms/posts.atom"


const PostPage = () => {
  const {user, loading} = useGetUserProfile()
  const showToast = useShowToast()
  const {pid} = useParams()
  const currentUser = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom)
  const currentPost = posts[0]
  const navigate = useNavigate()
  useEffect(()=> {
    
    const getPost = async() => {
      try {
        const res = await  fetch(`/api/posts/${pid}`)
        const data = await res.json()
        if(data.error){
          showToast('Error',  data.error, 'error')
        }
        setPosts([data])
      } catch (error) {
        showToast("Error", error.message, 'error ')
      } 
    }
    getPost()
    }, [showToast, pid, setPosts])

    const ePost = async (e) => {
      e.preventDefault(); // Ensure default behavior is prevented
      if (!window.confirm("Are you sure you want to delete this post?")) return;
  
      try {
          const res = await fetch(`/api/posts/${currentPost._id}`, {
              method: 'DELETE',
          });
          const data = await res.json();
          
          if (data.error) {
              showToast("Error", data.error, "error");
              return;
          }
          
          showToast("Success", "Post deleted", 'success');
          navigate(`/user/${user.username}`) // Reload the page after successful deletion
  
      } catch (error) {
          showToast("Error", error.message, 'error');
      }
  };
  console.log(currentPost)
  if(!user && loading) {
    return <Flex>
      <Spinner size={"xl"} />
    </Flex>
  }
  if(!currentPost) return null

  
  return (
    <>
        <Flex>
          <Flex w={'full'} alignItems={'center'} gap={3}>
      <Avatar  src={user.profilePic} size={'md'} name={user.name}/>
      <Flex>
        <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}
        </Text>
        <Image src="/verified.png" w={4} h={4} ml={4} />
      </Flex>

    </Flex>
    <Flex gap={4} alignItems={'center'}>
                            <Text fontSize='xs' width={65} color={'gray.light'}>{
                                formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
                            {currentUser?._id === user._id  && <Delete size={20} onClick={ePost} cursor={'pointer'} /> }
                        </Flex>
    </Flex>
    <Text my={3}>
      {currentPost.text}
    </Text>
    {currentPost.img && (
      <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={"gray.light"}>
      {<Image src={currentPost.img} w={'full'} />}
  </Box>
    )}
    <Flex gap={3} my={3}>
      <Actions  post={currentPost}/>
    </Flex>
    <Divider  my={4} />
    {currentPost.replies.map((reply, index) => (
    <Comment 
        key={reply._id} 
        reply={{ ...reply, username: reply.username }} // Ensure it has the username
        lastReply={index === currentPost.replies.length - 1} 
    />
))}
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

    </>


  )
}

export default PostPage
