import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Send } from 'lucide-react';
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationAtoms, selectedConversationAtom } from "../atoms/message.atom";
import { useRecoilValue, useSetRecoilState } from "recoil";

const MessageInput = ({setMessages}) => {
  const [messageText, setMessageText] = useState('')
  const setConversations = useSetRecoilState(conversationAtoms);
  const showToast = useShowToast()
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
        const res = await fetch(`/api/messages/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: messageText,
                recipientId: selectedConversation.userId,
            }),
        });
        
        // Await the response to get the data
        const data = await res.json(); // Make sure to await here
        console.log(data); // Now this will show the resolved message object

        setMessages((messages) => [...messages, data]);
        setMessageText(''); // Clear the input after sending
        setConversations((prevConvs) => {
          const updatedConversations = prevConvs.map((conversation) => {
            if (conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: messageText,
                  sender: data.sender,
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
        });
    } catch (error) {
        showToast("Error", error.message, "error");
    }
}

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
      <Input placeholder='Type a message...' w={"full"} onChange={(e)=> {
        setMessageText(e.target.value)
      }}
      value={messageText} />
      <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
        <Send size={24} />
      </InputRightElement>
    </InputGroup>
      
    </form>
    
  );
}

export default MessageInput;
