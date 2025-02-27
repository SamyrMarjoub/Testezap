import colors from '@/app/styles/colors'
import { Box, Text, Button, Input } from '@chakra-ui/react';
import React, { useState } from 'react'
import Image from 'next/image'
import { useGlobalState } from '@/globalstate/globalstate';
import { MdSend } from 'react-icons/md';
import moment from "moment";
import { sendMessage } from '../../firestore.ts/firestore';
import { useChatMessages } from "../../firestore.ts/firestore";

export default function Maincomponent() {

  const [message, setMessage] = useState('');
  const [userSelectedData, setUserSelectedData] = useGlobalState('userSelectedData')
  const [userData, setUserData] = useGlobalState('userData')

  const chatId = userData?.uid && userSelectedData?.uid
    ? [userData.uid, userSelectedData.uid].sort().join('_')
    : null;

  const messages = useChatMessages(chatId);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) return;

    setMessage(''); // Limpa o input imediatamente

    await sendMessage(chatId, userData.uid, userSelectedData.uid, message);
  };


  return (
    <Box
      width={{ base: '100%', md: '80%', lg: '70%' }}
      height="100%"
      display="flex"
      padding="10px"
    >
      <Box width="100%" height="100%" borderRadius="12px">

        {/* Header */}
        <Box width="100%" height="10%">
          <Box
            width="100%"
            bg={colors.default.bg_primary}
            borderRadius="20px"
            height={{ base: '60px', md: '80px' }} // Ajuste dinâmico
            display="flex"
            alignItems="center"
            paddingX="16px"
          >
            <Box borderRadius="10px" width="40px" height="40px" overflow="hidden">
              {userSelectedData?.profilePicture ? (
                <img
                  src={userSelectedData.profilePicture}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Box width="100%" height="100%" bg={userSelectedData.defaultcolor} />
              )}
            </Box>
            <Text ml="12px" fontSize={{ base: '16px', md: '20px' }} fontWeight="bold" color="white">
              {userSelectedData?.username}
            </Text>
          </Box>
        </Box>

        <Box
          width="100%"
          height="80%"
          overflowY="auto"
          padding="10px"
          borderRadius="10px"
          display="flex"
          flexDirection="column"
          gap="8px"
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              alignItems="center"
              justifyContent={msg.sender === userData.uid ? 'flex-end' : 'flex-start'}
            >
              {msg.sender !== userData.uid && (
                <Box
                  borderRadius="full"
                  overflow="hidden"
                  width="35px"
                  height="35px"
                >
                  {userSelectedData?.profilePicture ? (
                    <Image
                      src={userSelectedData.profilePicture}
                      alt={msg.sender}
                      width={35}
                      height={35}
                    />
                  ) : (
                    <Box width="100%" height="100%" bg={userSelectedData.defaultcolor} borderRadius="full" />
                  )}
                </Box>
              )}
              <Box
                margin={'5px'}
                bg={msg.sender === userData.uid ? colors.default.blue : colors.default.bg_primary}
                color="white"
                padding="10px"
                borderRadius="12px"
                maxWidth={{ base: "80%", md: "60%" }} // Ajuste dinâmico
                textAlign="left"
              >
                <Text fontSize="14px">{msg.content}</Text>
                <Text fontSize="10px" color="gray.300" textAlign="right">
                  {msg.timestamp ? moment(msg.timestamp.seconds * 1000).format("HH:mm") : ""}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input container */}
        <Box
          width="100%"
          height="10%"
          bg={colors.default.bg_primary}
          display="flex"
          alignItems="center"
          padding="10px"
          borderRadius="10px"
        >
          <Input
            flex="1"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            color="white"
            resize="none"
            border="none"
            padding={{ base: "10px", md: "20px" }} // Ajuste dinâmico
            borderRadius="20px"
            height="100%"
            _focus={{ outline: 'none', borderColor: 'blue.400' }}
            _placeholder={{ color: 'gray.400' }}
          />
          <Button onClick={handleSendMessage} ml="10px" bg="transparent">
            <MdSend color="white" />
          </Button>
        </Box>

      </Box>
    </Box>


  )
}
