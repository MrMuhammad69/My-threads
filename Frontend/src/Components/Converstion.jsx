import { Avatar, AvatarBadge, Flex, Image, Stack, WrapItem, Text, useColorModeValue, useColorMode } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import { selectedConversationAtom } from "../atoms/message.atom"; // Import the selectedConversation atom
import { Check } from 'lucide-react';

const Conversation = ({ conversation }) => {
    const user = conversation?.participants[0];
    const lastMessage = conversation?.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    console.log(selectedConversation);
    const colorMode = useColorMode()

    return (
        <Flex 
            gap={4} 
            alignItems={'center'} 
            p={1} 
            _hover={{
                cursor: 'pointer',
                bg: useColorModeValue('gray.600', 'gray.dark'),
                color: 'white'
            }} 
            onClick={() => setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                userProfilePic: user.profilePic,
                username: user.username,
                mock: conversation.mock
            })} 
            bg={selectedConversation?._id === conversation._id ? (colorMode ==='light' ? 'gray.400':'gray.dark') : ''}
            borderRadius={'md'}
        >
            <WrapItem>
                <Avatar size={{
                    base: 'xs',
                    sm: 'sm',
                    md: 'md'
                }} src={user.profilePic}>
                    <AvatarBadge boxSize={'1em'} bg={"green.500"} />
                </Avatar>
            </WrapItem>
            <Stack direction={'column'} fontSize={'sm'}>
                <Text fontWeight={'700'} display={'flex'} alignItems={'center'}>
                    {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
                </Text>
                <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
                    {currentUser._id === lastMessage.sender ? <Check size={20} /> : null}
                    {lastMessage.text.length > 12 ? lastMessage.text.slice(0, 12) + '...' : lastMessage.text}
                </Text>
            </Stack>
        </Flex>
    );
}

export default Conversation;
