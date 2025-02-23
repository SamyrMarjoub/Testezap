import colors from '@/app/styles/colors'
import { Box, Input, Text } from '@chakra-ui/react'
import Image from 'next/image'
import cavera from '../../../../../public/cavera.jpg'
import pathethic from '../../../../../public/pathethic.png'
import React, { useState } from 'react'
import gato from '../../../../../public/gato.jpg'
import { FaCog, FaSignOutAlt } from 'react-icons/fa'
export default function component() {

  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, avatar: cavera, name: 'Lord Caveira', lastMessage: 'Manda 2 doses ai', time: '22h' },
    { id: 2, avatar: pathethic, name: 'Pathethic', lastMessage: 'Patético', time: '1h' }
  ];

  const ChatItem = ({ avatar, name, lastMessage, time, isSelected, onClick }) => {
    return (
      <Box
        cursor={'pointer'}
        borderRadius={'20px'}
        _hover={{ bg: colors.default.bg_primary }}
        mt={'10px'}
        w={'100%'}
        height={'auto'}
        p={'10px'
        }
        pt={'10px'}
        pb={'10px'}
        bg={isSelected ? colors.default.bg_primary : 'transparent'}
        onClick={onClick}
      >
        <Box display={'flex'} alignItems={'center'}>
          {/* Box da imagem */}
          <Box w={'100px'} h={'100px'} flexShrink={0} overflow={'hidden'} borderRadius={'20px'}>
            <Image alt='avatar' src={avatar} w={'100%'} h={'100%'} objectFit={'cover'} />
          </Box>
          {/* Box do conteúdo do chat */}
          <Box ml={3} flex={'1'} gap={'10px'} display={'flex'} flexDir={'column'} overflow={'hidden'}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
              <Text fontWeight={'bold'} fontSize={'lg'} isTruncated>
                {name}
              </Text>
              {/* Box do tempo */}
              <Text color={'gray.400'} fontSize={'xs'} ml={2}>
                {time}
              </Text>
            </Box>
            <Text color={'gray.500'} fontSize={'sm'} isTruncated>
              {lastMessage}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box padding={'10px'} display={'flex'} justifyContent={'center'} flexDir={'column'} bg={colors.default.bg_secondary} width={'30%'} height={'100%'}>
      <Box height={'80px'} width={'100%'}>
        <Input placeholder='Search' padding={'20px'} border={'none'} outline={'none'} borderRadius={'20px'} height={'100%'} bg={colors.default.bg_primary} type='text' />
      </Box>
      <Box pt={'0'} overflow={'auto'} height={'90%'}>
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            avatar={chat.avatar}
            name={chat.name}
            lastMessage={chat.lastMessage}
            time={chat.time}
            isSelected={selectedChat === chat.id}
            onClick={() => setSelectedChat(chat.id)}
          />
        ))}

      </Box>
      <Box width={'100%'} justifyContent='center' display={'flex'} height={'10%'}>
        <Box bg={colors.default.bg_primary} width={'100%'} display={'flex'} alignItems={'center'} p={'10px'}>
          <Box borderRadius={'20px'} width={'80px'} height={'80px'} overflow={'hidden'}>
            <Image style={{ borderRadius: '20PX' }} alt='avatar' src={gato} width={'100%'} h={'100%'} objectFit={'cover'} />
          </Box>

          <Box ml={3} display={'flex'} flexDirection={'column'} justifyContent={'center'} flex={1}>
            <Text fontWeight={'bold'} fontSize={'lg'}>{'Laito'}</Text>
            <Text color={'gray.500'} fontSize={'sm'}>ID: {1223}</Text>
          </Box>

          <Box display={'flex'} gap={3} ml={3}>
            <FaCog size={24} cursor={'pointer'} />
            <FaSignOutAlt size={24} cursor={'pointer'} />
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
