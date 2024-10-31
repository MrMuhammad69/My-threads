import {
    Avatar,
    Divider,
    Flex,
    Image,
    Skeleton,
    SkeletonCircle,
    Text,
    useColorModeValue
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationAtoms, selectedConversationAtom } from "../atoms/message.atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/user.atom";
import { useSocket } from "../context/SocketContext";
import MessageSound from "../assets/message.mp3"


const MessageContainer = () => {
    const [loadingMessages, setLoadingMessages] = useState(true);
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const {socket} = useSocket()
    const setConversations = useSetRecoilState(conversationAtoms)
    const messagesEndRef = useRef(null)



    useEffect(()=> {
        if(socket){
            socket.on('newMessage', (message) => {
               if(selectedConversation._id === message.conversationId){
                setMessages((prevMessages) => [...prevMessages, message])
               }
               if(!document.hasFocus()){
                const sound = new Audio(MessageSound)
                sound.play()
               }
                setConversations((prev) => {
                    const updatedConversations = prev.map((conversation) => {
                        if (conversation._id === message.conversationId) {
                            return {
                                ...conversation,
                                lastMessage: {
                                    text: message.text,
                                    sender: message.sender,
                                },
                            };
                        }
                        return conversation;
                    });
                    return updatedConversations;
                }); 
            })
        }
        return () => {
            if(socket){
                socket.off('newMessage')
            }
        }
    }, [socket, selectedConversation, setConversations])

    useEffect(() => {
        if (!socket) return;

        const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
        if (lastMessageIsFromOtherUser) {
            socket.emit("markMessagesAsSeen", {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            });
        }

        const handleMessagesSeen = ({ conversationId }) => {
            if (selectedConversation._id === conversationId) {
                setMessages((prev) => {
                    const updatedMessages = prev.map((message) => {
                        if (!message.seen) {
                            return {
                                ...message,
                                seen: true,
                            };
                        }
                        return message;
                    });
                    return updatedMessages;
                });
            }
        };

        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("messagesSeen", handleMessagesSeen);
        };
    }, [socket, currentUser._id, messages, selectedConversation]);

    useEffect(()=> {
            messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])


    useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

    return (
        <Flex
            flex={70}
            bg={useColorModeValue('gray.200', 'gray.dark')}
            p={2}
            borderRadius={'md'}
            flexDirection={'column'}
            height="580px" // Increased height to 800px
        >
            <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
                <Text display={'flex'} alignItems={'center'} gap={1}>
                    {selectedConversation.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
            </Flex>
            <Divider />
            {/* Messages Container with a fixed height and scroll */}
            <Flex flexDirection={'column'} flex={1} gap={4} p={2} overflowY={'auto'}>
                {loadingMessages && (
                    [...Array(5)].map((_, index) => (
                        <Flex
                            key={`skeleton-${index}`} // Unique key for skeletons
                            gap={2}
                            alignItems={'center'}
                            p={1}
                            borderRadius={'md'}
                            alignSelf={index % 2 === 0 ? 'flex-start' : 'flex-end'}
                        >
                            {index % 2 === 0 && <SkeletonCircle size={'7'} />}
                            <Flex gap={2} flexDirection={'column'}>
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                                <Skeleton h="8px" w="250px" />
                            </Flex>
                            {index % 2 !== 0 && <SkeletonCircle size={'7'} />}
                        </Flex>
                    ))
                )}
                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex ref={messages.length -1 === messages.indexOf(message) ? messagesEndRef : null} key={message._id} direction={'column'}>
                        <Message message={message} ownMessage={message.sender === currentUser._id} />
                        </Flex>
                    ))}
            </Flex>
            <Divider />
            {/* Message Input at the bottom */}
            <MessageInput setMessages={setMessages} />
        </Flex>
    );
}

export default MessageContainer;
