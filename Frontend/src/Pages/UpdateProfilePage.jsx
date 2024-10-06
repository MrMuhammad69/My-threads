import { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/user.atom';
import usePreviewImage from '../hooks/usePreviewImage'; 
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {
  const fileref = useRef(null);
  const { handleImageChange, imgUrl } = usePreviewImage();
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name || '',
    bio: user.bio || '',
    email: user.email || '',
    password: '', // Users can leave it empty if they don’t want to change
    username: user.username || '',
  });
  const [updating, setUpdating] = useState(false); // Loading state
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return; // Prevent multiple submissions
    setUpdating(true);

    try {
        const res = await fetch(`/api/users/update/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        });
        
        const data = await res.json();
        console.log('Updated User Data:', data); // Log to inspect

        if (data.error) {
            showToast("Error", data.error, 'error');
            return;
        }

        showToast('Success', data.message, 'success');
        
        // Set user state and update local storage
        setUser(data);
        localStorage.setItem("user-threads", JSON.stringify(data)); // Ensure the full data is saved

    } catch (error) {
        showToast('Error', error.message, 'error');
    } finally {
        setUpdating(false); // Reset loading state
    }
};


  const handleCancel = () => {
    // Reset inputs to original user data
    setInputs({
      name: user.name || '',
      bio: user.bio || '',
      email: user.email || '',
      password: '', // Clear password on cancel
      username: user.username || '',
    });
    // Optionally reset imgUrl to user.profilePic if needed
  };

  const handleRemoveAvatar = () => {
    // Logic to reset avatar to default or remove it
    setUser({ ...user, profilePic: '' });
    // If you want to clear imgUrl as well
    // imgUrl = ''; // Reset imgUrl, if necessary
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={'center'} justify={'center'}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Edit your profile
          </Heading>

          <FormControl>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.profilePic}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                    onClick={handleRemoveAvatar} // Remove avatar logic
                  />
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileref.current.click()}>
                  Change Avatar
                </Button>
                <Input type="file" hidden ref={fileref} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>

          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Username"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
          </FormControl>

          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              onClick={handleCancel}
              _hover={{
                bg: 'red.500',
              }}
            >
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              type="submit"
              _hover={{
                bg: 'blue.500',
              }}
              isLoading={updating} // Show loading state
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
