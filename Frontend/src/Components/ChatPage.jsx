import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import {Search} from 'lucide-react'
import { MessagesSquare } from 'lucide-react';
import Converstion from "./Converstion"
import MessageContainer from "./MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationAtoms, selectedConversationAtom } from "../atoms/message.atom";
import userAtom from "../atoms/user.atom";
import { useSocket } from "../context/SocketContext";
const ChatPage = () => {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useRecoilState(conversationAtoms)
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [search, setSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const showToast = useShowToast()
  const currentUser = useRecoilValue(userAtom)
  const {socket, onlineUsers} = useSocket()
  useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

  useEffect(()=> {

    const getConversations = async () => {
      
      try {
        const res = await fetch("/api/messages/conversations")
        const data = await res.json()
        if(data.error){
          showToast("Error", data.error, "error")
        }
        console.log(data)
        setConversations(data)
      } catch (error) {
        showToast("Error", error.message, "error");
        
      } finally{
        setLoading(false)
      }
      
    }
    getConversations()
  }, [showToast, setConversations, socket, setLoading])
  const handleConversationSearch = async (e) => {
    e.preventDefault()
    setSearching(true)
    try {
      const res = await fetch(`/api/users/profile/${search}`)
      const searchedUser = await res.json()
      if(searchedUser.error){
        showToast("Error", searchedUser.error, 'error')
        return
      }
      if(searchedUser._id === currentUser._id){
        showToast("Error", "You can't message yourself", 'error')
        return
      }
      // If user is already in a conversation
      const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}
      const mockConversation = {
        mock: true,
        lastMessage:{
          text: '',
          sender: '',
        },
        _id:Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic
          }
        ]
      }
      setConversations((prevConv) => [...prevConv, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, 'error')
    } finally{
      setSearching(false)
      setSearch('')
    }
  }
  return (
    <Box position={"absolute"} left={'50%'} transform={'translatex(-50%)'} w={{
      "lg": "750px",
      "md": "80%",
      'base': "100%"
    }} p={4}>
      <Flex gap={4} flexDirection={{
        'base': "column",
        "md": 'row'

      }} maxW={{
        sm: '400px',
        md: 'full'
      }}>
        <Flex flex={30} gap={2} flexDirection={'column'} maxW={{
          sm: '250px',
          md: '500px'
        }}  >
          <Text fontWeight={700} color={useColorModeValue('gray.600', 'gray.400')}>
            Your conversations

          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} value={search}  />
              <Button size={'sm'} isLoading={searching} onClick={handleConversationSearch}>
                <Search />
              </Button>
            </Flex>
          </form>
          {loading && (
  [0, 1, 2, 3, 4].map((_, i) => (
    <Flex key={i} gap={4} alignItems={'center'} p={1} borderRadius={'md'}>
      <SkeletonCircle size={10} />
      <Flex w={'full'} flexDirection={'column'} gap={3}>
        <Skeleton h={'10px'} w={'80px'} />
        <Skeleton h={'8px'} w={'90%'} />
      </Flex>
    </Flex>
  ))
)}
          {!loading && (
            conversations.map((conversation)=> {
              return <Converstion key={conversation._id}
              isOnline={onlineUsers.includes(conversation.participants[0]._id)}
              conversation={conversation} />
            })
          )}
        </Flex>
        {!selectedConversation._id && (
          <Flex flex={70} borderRadius={'md'} p={2} flexDir={'column'} alignItems={'center'} justifyContent={'center'} height={'400px'}>
          <MessagesSquare size={100} />
          <Text font size={20}>
            Select a conversation to start messaging
          </Text>

        </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
        
        
      </Flex>
    </Box>
  )
}

export default ChatPage
