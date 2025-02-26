import colors from '@/app/styles/colors'
import { Box, Text, Textarea, Button, Input, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { db } from '@/app/services/firebaseClient';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, increment, addDoc, collection, orderBy, onSnapshot, query, runTransaction } from 'firebase/firestore';
import { useGlobalState } from '@/globalstate/globalstate';
import { MdSend } from 'react-icons/md';
import { color } from 'framer-motion';

export default function maincomponent() {

  const [message, setMessage] = useState('');
  const [userSelectedData, setUserSelectedData] = useGlobalState('userSelectedData')
  const [userData, setUserData] = useGlobalState('userData')

  const sendMessage = async (chatId: string, senderId: any, receiverId: string | number, content: string, type = "text") => {
    if (!chatId || !senderId || !receiverId || !content) return;

    try {
      const messagesRef = collection(db, `chats/${chatId}/messages`);

      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        content: content,
        timestamp: serverTimestamp(),
        status: "sent",
        type: type,
      };

      await addDoc(messagesRef, newMessage);

      // Referência para o chat
      const chatRef = doc(db, `chats/${chatId}`);

      // Obtém o chat atual para incrementar unreadMessages
      await runTransaction(db, async (transaction) => {
        const chatDoc = await transaction.get(chatRef);

        if (!chatDoc.exists()) {
          transaction.set(chatRef, {
            lastMessage: content,
            lastMessageTimestamp: serverTimestamp(),
            lastSender: senderId,
            unreadMessages: { [receiverId]: 1 },
          });
        } else {
          const chatData = chatDoc.data();
          const currentUnread = chatData.unreadMessages?.[receiverId] || 0;

          transaction.update(chatRef, {
            lastMessage: content,
            lastMessageTimestamp: serverTimestamp(),
            lastSender: senderId,
            [`unreadMessages.${receiverId}`]: currentUnread + 1, // Atualiza corretamente
          });
        }
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };


  const useChatMessages = (chatId: unknown) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      if (!chatId) return;

      // Criar a query para pegar mensagens ordenadas por timestamp
      const messagesQuery = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy("timestamp", "asc")
      );

      // Escutar mensagens em tempo real
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(newMessages);
      });

      return () => unsubscribe(); // Remove o listener quando o chat muda
    }, [chatId]);

    return messages;
  };


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
    <Box width="100%" height="100%" display="flex" padding="10px">
      <Box width="100%" height="100%" borderRadius="12px">
        {/* Header */}
        <Box width="100%" height="10%">
          <Box width="100%" bg={colors.default.bg_primary} borderRadius="20px" height="80px" display="flex" alignItems="center" paddingX="16px">
            <Box borderRadius="10px" width="50px" height="50px" overflow="hidden">
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
            <Text ml="12px" fontSize="20px" fontWeight="bold" color="white">
              {userSelectedData?.username}
            </Text>
          </Box>
        </Box>

        {/* Chat messages container */}
        <Box width="100%" height="80%" overflowY="auto" padding="10px" borderRadius="10px" display="flex" flexDirection="column" gap="8px">
          {messages.map((msg) => (
            <Box key={msg.id} display="flex" alignItems="center" justifyContent={msg.sender === userData.uid ? 'flex-end' : 'flex-start'}>
              {msg.sender !== userData.uid && (
                <Box
                  borderRadius="full"
                  overflow="hidden"
                  width="40px"
                  height="40px"
                  position="relative"
                >
                  {userSelectedData?.profilePicture ? (
                    <Image
                      src={userSelectedData.profilePicture}
                      alt={msg.sender}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Box width="100%" height="100%" bg={userSelectedData.defaultcolor} borderRadius="full" />
                  )}
                </Box>
              )}
              <Box margin={'5px'} bg={msg.sender === userData.uid ? colors.default.blue : colors.default.bg_primary} color="white" padding="10px" borderRadius="12px" maxWidth="60%" textAlign="left">
                <Text fontSize="14px">{msg.content}</Text>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input container */}
        <Box width="100%" height="10%" bg={colors.default.bg_primary} display="flex" alignItems="center" padding="10px" borderRadius="10px">
          <Input
            flex="1"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            color="white"
            resize={'none'}
            border="none"
            padding="20px"
            borderRadius="20px"
            height="100%"
            _focus={{ outline: 'none', borderColor: 'blue.400' }}
            _placeholder={{ color: 'gray.400' }}
          />
          <Button onClick={handleSendMessage} ml="10px" bg={'transparent'}>
            <MdSend color='white' />

          </Button>
        </Box>
      </Box>
    </Box>

  )
}
