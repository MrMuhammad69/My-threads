import { Flex, Avatar, Box, Text, Image } from "@chakra-ui/react";
import { Link,} from "react-router-dom";
import Actions from "./Actions.jsx";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import {formatDistanceToNow} from 'date-fns'
import { Delete } from 'lucide-react';
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom.js";


const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${postedBy}`);
                const data = await res.json();
                console.log(data);
                if (data.error) {
                    showToast("Error", data.error, 'error');
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message || "Failed to fetch user", 'error');
                setUser(null);
            }
        };
        getUser();
    }, [postedBy, showToast]);
    const handleDeletePost = async (e) => {
        e.preventDefault(); // Ensure default behavior is prevented
        if (!window.confirm("Are you sure you want to delete this post?")) return;
    
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            
            showToast("Success", "Post deleted", 'success');
            window.location.reload(); // Reload the page after successful deletion
    
        } catch (error) {
            showToast("Error", error.message, 'error');
        }
    };
    


    if (!user) {
        return null; // Optionally, return a loading spinner or placeholder
    }

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Link to={`/user/${user.username}`}>
                        <Avatar src={user?.profilePic} size={'md'} name={user?.username} />
                    </Link>
                    <Box width={'1px'} height={'full'} bg='gray.light' my={2} />
                    <Box position={'relative'} w={'full'}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
						{post.replies[0] && (
							<Avatar
								size='xs'
								name={user?.name}
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{post.replies[1] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{post.replies[2] && (
							<Avatar
								size='xs'
								name='John doe'
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex justifyContent={'space-between'} w={'full'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Link to={`/user/${user.username}`}>
                                <Text fontSize={'sm'} fontWeight={'bold'}>{user?.username}</Text>
                            </Link>
                            {user.isVerified && <Image src="/verified.png" w={4} h={4} ml={1} />}
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize='xs' width={65} color={'gray.light'}>{
                                formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                            {currentUser?._id === user._id  && <Delete size={20} onClick={handleDeletePost} /> }
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={'hidden'} border={'1px solid'} borderColor={"gray.light"}>
                            <Image src={post.img} w={'full'} />
                        </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;