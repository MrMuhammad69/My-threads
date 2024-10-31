import { 
  Avatar, 
  Box, 
  Flex, 
  VStack, 
  Text, 
  Link, 
  Menu, 
  MenuButton, 
  Portal, 
  MenuList, 
  MenuItem, 
  useToast, 
  Button 
} from "@chakra-ui/react";
import { Instagram, MoreHorizontal } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/user.atom.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useFollowUnfollow from "../hooks/useFollowUnfollow.js";
import useShowToast from "../hooks/useShowToast.js";
import useLogout from '../hooks/useLogout.js';
import { useState } from "react";

const UserHeader = ({ user }) => {

  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const logout = useLogout();
  const navigate = useNavigate(); // Initialize navigate

  const handleFreezeAccount = async () => {
    if(window.confirm('Are you sure you want to freeze your account?')){
      setLoading(true);
      try {
        const res = await fetch('/api/users/freeze', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        if(data.success){
          await logout();
          navigate('/'); // Redirect to homepage
        } else if(data.error){
          showToast('Error', data.error, 'error');
        }
      } catch (error) {
        showToast('Error', error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const copyUrl = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: 'Profile link is copied' });
    });
  };

  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

  if (!user) {
    return null;
  }

  return (
    <VStack gap={4} align={'start'} w={'full'}>
      <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'}>
        <Box>
          <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight={"bold"}>
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

        <Avatar
          name={user.name}
          src={user.profilePic || 'https://bit.ly/broken-link'}
          size={{ base: 'md', md: 'xl' }}
        />
      </Flex>

      <Text>
        {user.bio}
      </Text>

      {currentUser && currentUser?._id === user._id ? (
        <Flex gap={2}>
          <Button as={RouterLink} to="/update" size={'sm'}>
            Update Profile
          </Button>
          <Button size={'sm'} bg={'red.400'} _hover={{ bg: 'red.500' }}  isLoading={loading} onClick={handleFreezeAccount}>
            Freeze Account
          </Button>
        </Flex>
      ) : (
        <Button size={'sm'} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}

      <Flex w={'full'} justifyContent={'space-between'} alignItems="center">
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>
            {user.followers.length} followers
          </Text>
          <Box w='1' h='1' bg={'gray.light'} borderRadius={'full'} />
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
