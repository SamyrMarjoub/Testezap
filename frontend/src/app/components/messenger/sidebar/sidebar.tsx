"use client"
import colors from '@/app/styles/colors'
import { Box, Icon, Input, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaCog, FaSignOutAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { setGlobalState, useGlobalState } from '@/globalstate/globalstate'
import { FiX } from 'react-icons/fi'
import { subscribeToLastMessages, subscribeToFriendships } from '../../firestore.ts/firestore'

export default function Component({ onClose, windowWidth }) {

  const [selectedChat, setSelectedChat] = useState(null);
  const [userData, setUserData] = useGlobalState('userData')
  const router = useRouter();
  const uid = localStorage.getItem('uid')
  const [friendsList, setFriendsList] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  function logOut() {
    localStorage.removeItem('uid')
    localStorage.removeItem('email')
    localStorage.removeItem('token')

    router.push('/login')
  }

  const AvatarComponent = ({ userData }: { userData: any }) => {
    const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "?";

    return userData?.profilePicture ? (
      <img
        alt="avatar"
        src={userData.profilePicture}
        width={'100%'}
        key={userData.profileImageUrl}
        height={'100%'}
        style={{ borderRadius: "20px", objectFit: "cover" }}
      />
    ) : (
      <Box
        width="80px"
        height="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // borderRadius="50%"
        backgroundColor={userData?.defaultcolor || "#ccc"}
        color="white"
        fontSize="2xl"
        fontWeight="bold"
      >
        <Text>{getInitial(userData?.username)}</Text>
      </Box>
    );
  };

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToLastMessages(uid, friendsList, setLastMessages);

    return () => unsubscribe(); // Remove listeners ao desmontar
  }, [friendsList, uid]);

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = subscribeToFriendships(uid, setFriendsList);

    return () => unsubscribe(); // Remove listeners ao desmontar
  }, [uid]);

  const ChatItem = ({ avatar, name, lastMessage, time, isSelected, onClick, defaultcolor }) => {
    return (
      <Box
        cursor={'pointer'}
        borderRadius={'20px'}
        _hover={{ bg: colors.default.bg_primary }}
        mt={'10px'}
        w={'100%'}
        height={'auto'}
        p={'10px'}
        pt={'10px'}
        pb={'10px'}
        bg={isSelected ? colors.default.bg_primary : 'transparent'}
        onClick={onClick}
      >
        <Box display={'flex'} alignItems={'center'}>
          {/* Box da imagem */}
          <Box
            w={'100px'}
            h={'100px'}
            flexShrink={0}
            overflow={'hidden'}
            borderRadius={'20px'}
          >
            {avatar ? (
              <img alt='avatar' src={avatar} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Box
                width="100%"
                height="100%"
                bg={defaultcolor}
                borderRadius="20px"
              />
            )}
          </Box>
          {/* Box do conteúdo do chat */}
          <Box
            ml={3}
            flex={'1'}
            gap={'10px'}
            display={'flex'}
            flexDir={'column'}
            overflow={'hidden'}
          >
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight={'bold'} fontSize={'lg'} isTruncated>
                {name}
              </Text>
              {/* Box do tempo */}
              <Text color={'gray.400'} fontSize={'xs'} ml={2}>
                {time}
              </Text>
            </Box>
            <Text color={'gray.400'} fontSize={'sm'} isTruncated>
              {lastMessage}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      className="SidebarMainContainer"
      padding={'10px'}
      display={'flex'}
      justifyContent={'center'}
      flexDir={'column'}
      bg={colors.default.bg_secondary}
      width={windowWidth < 800 ? '100%' : { md: '40%', lg: '30%' }}
      height={'100%'}
      position={windowWidth < 800 ? 'fixed' : 'relative'}
      left={0}
      top={0}
      zIndex={1000}
      overflowY="auto"
    >

      {windowWidth < 800 && (
        <Box
          position="absolute"
          right="20px"
          top="20px"
          onClick={onClose}
          cursor="pointer"
          zIndex={1001}
        >
          <Icon as={FiX} color="white" boxSize={6} />
        </Box>
      )}

      <Box height={{ base: '60px', md: '80px' }} width={'100%'}>
        <Input
          color={'gray.400'}
          _placeholder={{ color: 'gray.400' }}
          placeholder="Search"
          padding={{ base: '10px', md: '20px' }}
          border="none"
          outline="none"
          borderRadius="20px"
          height={'100%'}
          bg={colors.default.bg_primary}
          type="text"
        />
      </Box>

      <Box
        onClick={() => setGlobalState('isOpenModalFriend', true)}
        _hover={{ background: 'gray.700' }}
        cursor="pointer"
        display="flex"
        alignItems="center"
        height="40px"
        bg={colors.default.bg_primary}
        mt="10px"
        padding="20px"
        borderRadius="10px"
        width="100%"
      >
        <Text fontSize="14px" color="gray.400">
          Adicionar Amigo
        </Text>
      </Box>

      <Box pt="0" overflowY="auto" height="90%">
        {friendsList.map((friend) => (
          <ChatItem
            key={friend.id}
            avatar={friend.profilePicture}
            name={friend.username}
            lastMessage={lastMessages[friend.id]?.lastMessage || ''}
            time={lastMessages[friend.id]?.time || ''}
            isSelected={selectedChat === friend.id}
            defaultcolor={friend.defaultcolor}
            onClick={() => {
              setGlobalState('userSelectedData', friend);
              windowWidth < 800 && onClose();
            }} />
        ))}
      </Box>

      <Box width="100%" justifyContent="center" display="flex" height="auto">
        <Box
          bg={colors.default.bg_primary}
          borderRadius="20px"
          width="100%"
          display="flex"
          alignItems="center"
          p="10px"
          flexWrap="wrap"
          gap={2}
        >
          <Box
            borderRadius="20px"
            width={{ base: '50px', md: '70px', lg: '80px' }} // Responsivo
            height={{ base: '50px', md: '70px', lg: '80px' }}
            overflow="hidden"
            flexShrink={0}
          >
            <AvatarComponent userData={userData} />
          </Box>

          <Box ml={3} display="flex" flexDirection="column" justifyContent="center" flex={1}>
            <Text fontWeight="bold" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>
              {userData.username}
            </Text>
            <Text color="gray.500" fontSize={{ base: 'xs', md: 'sm' }}>ID: 1223</Text>
          </Box>

          <Box display="flex" gap={3} ml={3} flexShrink={0}>
            <FaCog onClick={() => setGlobalState('isOpenModalConfig', true)} size={20} cursor="pointer" />
            <FaSignOutAlt onClick={logOut} size={20} cursor="pointer" />
          </Box>
        </Box>
      </Box>
    </Box>

  )
}
