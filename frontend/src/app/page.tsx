"use client"
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import colors from './styles/colors';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);

const HomePage = () => {

  const router = useRouter()
  return (
    <Box
      width="100%"
      height="100vh"
      // bg="linear-gradient(160deg, #EBF8FF 0%, #BEE3F8 100%)" // Gradiente corrigido
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={colors.default.bg_primary}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Flex
          direction="column"
          alignItems="center"
          p={8}
          bg={colors.default.bg_secondary}
          borderRadius="2xl"
          boxShadow="xl"
          textAlign="center"
          maxW="90vw"
          _hover={{
            transform: 'scale(1.02)',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <MotionBox
            as={FaWhatsapp}
            size="80px"
            color={colors.default.blue} // Cor do WhatsApp
            mb={6}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <Text
            fontSize={{ base: "4xl", md: "5xl" }}
            fontWeight="extrabold"
            bgGradient="linear(to-r, #3182CE, #25855A)" // Gradiente azul + verde
            bgClip="text"
            color={'white'}
            mb={4}
          >
            TesteZap 1.0
          </Text>

          <Text
            fontSize="xl"
            color="gray.300"
            maxW="400px"
            mb={6}
          >
            Conecte-se com seus contatos de forma simples e segura.
            Comece agora mesmo selecionando uma conversa ou iniciando uma nova!
          </Text>
          <Box width={'100%'}>
            <Button onClick={() => router.push('/login')} width={'100%'} height={'40px'} bg={colors.default.blue} color={'white'} fontSize={'18px'}>Começar!</Button>

          </Box>
          <Flex
            mt={4}
            gap={3}
            color="gray.300"
            alignItems="center"
          >
            <Box w="30px" h="2px" bg="#3182CE" opacity="0.5" />
            <Text fontSize="sm">v1.0.0</Text>
            <Box w="30px" h="2px" bg="#3182CE" opacity="0.5" />
          </Flex>
        </Flex>
      </MotionBox>
    </Box>
  );
};

export default HomePage;