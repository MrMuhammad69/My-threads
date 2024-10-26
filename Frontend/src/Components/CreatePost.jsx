import { AddIcon } from "@chakra-ui/icons"
import { Button, CloseButton, Flex, FormControl, Input, Text, Textarea, useColorModeValue, useDisclosure, Spinner, VStack } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image as ChakraImage
} from '@chakra-ui/react'
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImage"
import { Image as LucideImage } from "lucide-react"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/user.atom"
import useShowToast from "../hooks/useShowToast"
import postsAtom from "../atoms/posts.atom"
const CreatePost = () => {
    const showToast = useShowToast()
    const user = useRecoilValue(userAtom)
    const [posts,  setPosts] = useRecoilState(postsAtom)
    const [loading, setIsloading] = useState(false)

    const handleCreatePost = async ()=> {
        setIsLoading(true)
        try {
            const res = await fetch('/api/posts/create', {
                method: "POST",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({postedBy:user._id,text:postText, img:imgUrl})
            })
    
            const data = await res.json()
            if(data.error){
                showToast("Error", data.error, 'error')
             }
            showToast('Success', "Post created Successfully", 'success')
            setPosts([data, ...posts])
            onClose()
            setPostText('')
            setImgUrl('')
        } catch (error) {
            showToast("Error", error.message, 'error')
        } finally {
            setIsloading(false)
        }
        
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState('')
    const { handleImageChange, imgUrl, setImgUrl, imageSizes } = usePreviewImg()
    const [isLoading, setIsLoading] = useState(false)
    const imageRef = useRef(null)

    const handleTextChange = (e) => {
        setPostText(e.target.value)
    }

    const handleImageUpload = async (e) => {
        setIsLoading(true)
        await handleImageChange(e)
        setIsLoading(false)
    }

    return (
        <>
            <Button 
                position={'fixed'} 
                bottom={10} 
                right={30} 
                bg={useColorModeValue('gray.300', 'gray.dark')} 
                onClick={onOpen}
                size={'sm'}
            >
                <AddIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea 
                                placeholder="Post content goes here" 
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text 
                                fontSize={'xs'} 
                                fontWeight={'bold'} 
                                textAlign={'right'} 
                                m={1}
                                color={'gray.800'}
                            >
                                {postText.length}/500
                            </Text>
                            <Input 
                                type="file" 
                                hidden 
                                ref={imageRef} 
                                onChange={handleImageUpload}
                            />
                            <LucideImage 
                                size={24}
                                cursor={'pointer'}  
                                className="margin" 
                                onClick={() => imageRef.current.click()} 
                            /> 
                        </FormControl>
                        {isLoading ? (
                            <Flex justifyContent="center" my={5}>
                                <Spinner size="md" />
                            </Flex>
                        ) : imgUrl && (
                            <VStack mt={5} w={'full'} position={'relative'}>
                                <ChakraImage src={imgUrl} alt="Selected Image" />
                                <CloseButton 
                                    onClick={() => setImgUrl('')}
                                    bg={'gray.800'} 
                                    position={'absolute'} 
                                    top={2} 
                                    right={2}
                                />
                                {imageSizes.original && imageSizes.compressed && (
                                    <Text fontSize="sm" color="gray.500">
                                        Original: {imageSizes.original} KB | Compressed: {imageSizes.compressed} KB
                                    </Text>
                                )}
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreatePost