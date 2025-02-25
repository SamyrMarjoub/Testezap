import colors from '@/app/styles/colors'
import { Box, Text, Textarea, Button, Input, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import Caveira from '../../../../../public/cavera.jpg'
import Image from 'next/image'

export default function maincomponent() {

  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, sender: 'Lord Caveira', avatar: Caveira, text: 'Olá! Como vai?', isUser: false },
    { id: 2, sender: 'Você', avatar: Caveira, text: 'Oi! Estou bem, e você?', isUser: true },
    { id: 3, sender: 'Lord Caveira', avatar: Caveira, text: 'Tudo ótimo! Vamos jogar depois?', isUser: false },
  ];

  return (
    <Box width="100%" height="100%" display="flex" padding="10px">
      <Box width="100%" height="100%" borderRadius="12px">
        {/* Header */}
        <Box width="100%" height="10%" >
          <Box
            width="100%" bg={colors.default.bg_primary}
            borderRadius="20px"
            // bg="gray.700"
            height="80px"
            display="flex"
            alignItems="center"
            paddingX="16px"
          // boxShadow="md"
          >
            <Box borderRadius="10px" width="50px" height="50px" overflow="hidden">
              <Image src={Caveira} alt="Avatar" />
            </Box>
            <Text ml="12px" fontSize="20px" fontWeight="bold" color="white">
              Lord Caveira
            </Text>
          </Box>
        </Box>

        {/* Chat messages container */}
        <Box
          width="100%"
          height="80%"
          // bg="gray.900"
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
              justifyContent={msg.isUser ? 'flex-end' : 'flex-start'}
            >
              {!msg.isUser && (
                <Box borderRadius="full" overflow="hidden" width="40px" height="40px" position="relative">
                  <Image src={msg.avatar} alt={msg.sender} width={40} height={40} />
                </Box>
              )}
              <Box
                bg={msg.isUser ? 'blue.500' : colors.default.bg_primary}
                color="white"
                padding="10px"
                borderRadius="12px"
                maxWidth="60%"
                textAlign="left"
                ml={!msg.isUser ? "10px" : ""}
              >
                <Text fontSize="14px">{msg.text}</Text>
              </Box>
              {msg.isUser && (
                <Box borderRadius="full" overflow="hidden" width="40px" height="40px" position="relative" ml="10px">
                  <Image src={msg.avatar} alt={msg.sender} width={40} height={40} />
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Input container */}
        <Box width="100%" height="10%"
          bg={colors.default.bg_primary}

          display="flex" alignItems="flex-end" padding="10px" borderRadius="10px">
          <Input
            flex="1"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // bg="gray.800"
            color="white"
            border="none"
            padding={'20px'}
            borderRadius={'20px'}
            height={'100%'}
            _focus={{ outline: 'none', borderColor: 'blue.400' }}
            _placeholder={{ color: 'gray.400' }}
          />

        </Box>
      </Box>
    </Box>

  )
}
