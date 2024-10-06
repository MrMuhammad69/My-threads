import { Avatar, Box, Flex, VStack, Text, Link, Menu, MenuButton, Portal, MenuList, MenuItem, useToast } from "@chakra-ui/react";
import { Instagram, MoreHorizontal } from 'lucide-react';

const UserHeader = () => {
  const toast = useToast()
  const copyUrl =()=> {
    const currentURL = window.location.href
    navigator.clipboard.writeText(currentURL).then(()=> {
      toast({ description: 'Profile link is copied'})
    })
  }
  return (
    <VStack gap={4} align={'start'} w={'full'}>
      <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'}>
        <Box>
          {/* Name and Username */}
          <Text fontSize={{
            base: 'lg',
            md: 'xl',
            
          }} fontWeight={"bold"}>
            Mark Zuckerberg
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text fontSize={'sm'}>
              markzuckerberg
            </Text>
            {/* Threads.net label */}
            <Text fontSize={'xs'} bg={'gray.dark'} color={'gray.light'} p={1} borderRadius={'full'}>
              threads.net
            </Text>
          </Flex>
        </Box>

        {/* Avatar */}
        <Avatar name="Mark Zuckerberg" src="/zuck-avatar.png" size={
          {
            base: 'md',
            md:'xl'

          }
        } />
      </Flex>

      {/* Bio */}
      <Text>
        Cofounder, executive chairman of Meta Platform.
      </Text>

      {/* Followers and Instagram Link */}
      <Flex w={'full'} justifyContent={'space-between'} alignItems="center">
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>
            3.2k followers
          </Text>

          {/* Small Dot */}
          <Box w='1' h='1' bg={'gray.light'} borderRadius={'full'}></Box>

          {/* Instagram Link */}
          <Link color={'gray.light'} href="https://instagram.com" isExternal>
            instagram.com
          </Link>
        </Flex>
        <Flex>
            <Box className="icon-container">
              <Instagram size={24} cursor={'pointer'}></Instagram>
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                <MoreHorizontal size={24} cursor={'pointer'}></MoreHorizontal>
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
        <Flex flex={1} borderBottom={'1 px solid gray'} justifyContent={'center'} pb={3} cursor={'pointer'} color={'gray.light'}>
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
