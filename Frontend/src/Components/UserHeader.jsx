import { Avatar, Box, Flex, VStack, Text, Link, Menu, MenuButton, Portal, MenuList, MenuItem, useToast, Button } from "@chakra-ui/react";
import { Instagram, MoreHorizontal } from 'lucide-react';
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/user.atom.js'
import { Link as RouterLink } from 'react-router-dom'
import { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const [updating, setUpdating ] = useState(false )
  const showToast = useShowToast()
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom) // this is the user that has logged in
  const [following, setFollowing] = useState(user.followers.includes(currentUser?._id))

  useEffect(() => {
    if (currentUser && user) {
      setFollowing(user.followers.includes(currentUser?._id))
    }
  }, [currentUser, user])

  const copyUrl = () => {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: 'Profile link is copied' })
    })
  }

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
     showToast('Error', 'You have to login in order to Follow', 'error')
      return
    }
    if(updating) return;
    setUpdating(true)
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        }
      })
      const data = await res.json()
      if (data.error) {
        showToast('Error', data.error, 'error')
        return
      }
      setFollowing(!following)
      if(following){
        showToast('Success', `You have unfollowed ${user.name}`, 'success')
        user.followers.pop()

      } else{
        showToast("Success", `You have followed ${user.name}`, 'success')
        user.followers.push(currentUser?._id)
      }
    } catch (error) {
      showToast("Error", error, 'error')
    } finally{
      setUpdating(false)
    }
  }

  if (!user) {
    return null // or a loading indicator
  }

  return (
    <VStack gap={4} align={'start'} w={'full'}>
      <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'}>
        <Box>
          <Text fontSize={{
            base: 'lg',
            md: 'xl',
          }} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>
              {user.username}
            </Text>
            <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
              threads.net
            </Text>
          </Flex>
        </Box>

        {user.profilePic ? (
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: 'md',
              md: 'xl',
            }}
          />
        ) : (
          <Avatar
            name={user.name}
            src='https://bit.ly/broken-link'
            size={{
              base: 'md',
              md: 'xl',
            }}
          />
        )}
      </Flex>

      <Text>
        {user.bio}
      </Text>

      {currentUser && currentUser?._id === user._id && (
        <Link to="/update" as={RouterLink}>
          <Button size={'sm'}>
            Update Profile
          </Button>
        </Link>
      )}
      {currentUser && currentUser?._id !== user._id && (
        <Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}

      <Flex w={'full'} justifyContent={'space-between'} alignItems="center">
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>
            {user.followers.length} followers
          </Text>
          <Box w='1' h='1' bg={'gray.light'} borderRadius={'full'}></Box>
          <Link color={'gray.light'} href="https://instagram.com" isExternal>
            instagram.com
          </Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Instagram size={24} cursor={'pointer'} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <MoreHorizontal size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem bg={'gray.dark'} onClick={copyUrl}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={'full'}>
        <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb={3} cursor={'pointer'}>
          <Text fontWeight={'bold'}>Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={'1px solid gray'} justifyContent={'center'} pb={3} cursor={'pointer'} color={'gray.light'}>
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;