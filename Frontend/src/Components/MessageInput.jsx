import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { Send } from "lucide-react";
import { useState, useRef } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationAtoms, selectedConversationAtom } from "../atoms/message.atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IoSendSharp } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../hooks/usePreviewImage.js";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const setConversations = useSetRecoilState(conversationAtoms);
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl, isLoading } = usePreviewImage();
  const { onClose } = useDisclosure();
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;
    setLoading(true);
    setIsSending(true);
    try {
      const res = await fetch(`/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText || "",
          recipientId: selectedConversation.userId,
          img: imgUrl
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await res.json();
      setMessages((messages) => [...messages, data]);
      setMessageText("");
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText || "Sent an image",
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={"center"} width="100%">
      <form onSubmit={handleSendMessage} style={{ flex: "1" }}>
        <InputGroup>
          <Input
            placeholder="Type a message..."
            w={"full"}
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <Button isLoading={loading} boxSize="40px" p={0}>
              <Send size={20} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={() => imageRef.current.click()}
        p="2"
        borderRadius="full"
        _hover={{ bg: "gray.100" }}
      >
        <BsFillImageFill size={20} />
        <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      
      <Modal isOpen={!!imgUrl || isLoading} onClose={() => { onClose(); setImgUrl(""); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"} justifyContent="center" alignItems="center">
              {isLoading ? (
                <Spinner size="lg" />
              ) : (
                <Image src={imgUrl} />
              )}
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending && !isLoading ? (
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
