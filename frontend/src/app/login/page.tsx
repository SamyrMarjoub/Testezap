"use client"
import { Box, Button, HStack, Icon, Input, Link, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import colors from '../styles/colors'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {auth} from '../services/firebaseClient'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { HiOutlineChatBubbleOvalLeft } from 'react-icons/hi2'

export default function Page() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();

    async function handleLogin(e: { preventDefault: () => void }) {
        e.preventDefault();
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Obter o token JWT do Firebase Authentication
            const idToken = await user.getIdToken();
    
            // Enviar para o backend
            const response = await axios.post("http://localhost:5000/api/auth/loginUser", {
                idToken,
            });
    
            const { userId, email: userEmail } = response.data;
    
            localStorage.setItem("token", idToken);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("uid", userId);
    
            router.push("/messeger");
        } catch (error: any) {
            console.log("Erro ao registrar:", error.response?.data || error.message);
            alert(`Erro ao registrar: ${error.response?.data.message || "Erro desconhecido"}`);
        }
    }

    return (
        <Box
        bg={colors.default.bg_primary}
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        minHeight="100vh"
        padding="20px"
    >
        <Box
            width={['90%', '380px']}
            height="auto"
            padding={["15px", "25px"]}
            borderRadius="10px"
            bg="rgba(255, 255, 255, 0.05)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.1)"
        >
            <Box display="flex" flexDirection="column" width="100%" gap={4}>
                <Box textAlign="center" mb="15px">
                    <Icon 
                        as={HiOutlineChatBubbleOvalLeft} 
                        w={8} 
                        h={8} 
                        color={colors.default.blue} 
                        mb="10px"
                    />
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                        Welcome to TextZap!
                    </Text>
                    <Text fontSize="sm" color="gray.300" mt={1}>
                        Conecte-se para continuar
                    </Text>
                </Box>
    
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <Box display="flex" flexDirection="column" gap={4}>
                        <Input
                            type="email"
                            placeholder="Email"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="45px"
                            color="white"
                            onChange={(e)=>setEmail(e.target.value)}
                            padding={'10px'}
                            _placeholder={{ color: 'gray.300' }}
                            // focusBorderColor={colors.default.blue}
                        />
                        
                        <Input
                            type="password"
                            placeholder="Senha"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="45px"
                            padding={'10px'}
                            color="white"
                            onChange={(e)=>setPassword(e.target.value)}
                            _placeholder={{ color: 'gray.300' }}
                            // focusBorderColor={colors.default.blue}
                        />
    
                        <Button
                            type="submit"
                            height="45px"
                            bg={colors.default.blue}
                            color="white"
                            _hover={{ bg: 'blue.600', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            Entrar
                        </Button>
                    </Box>
                </form>
    
                <HStack justify="center" mt={2}>
                    <Text fontSize="sm" color="gray.300">
                        Não tem conta?{' '}
                        <Link 
                            href="/register" 
                            color={colors.default.blue}
                            fontWeight="500"
                            _hover={{ textDecoration: 'underline' }}
                        >
                            Registre-se
                        </Link>
                    </Text>
                </HStack>
    
                {/* <HStack width="100%" my={4}>
                <Box 
                    flex={1} 
                    borderTop="1px solid" 
                    borderColor="rgba(255, 255, 255, 0.3)"
                />
                <Text 
                    fontSize="sm" 
                    color="gray.300" 
                    px={2}
                    whiteSpace="nowrap"
                >
                    OU
                </Text>
                <Box 
                    flex={1} 
                    borderTop="1px solid" 
                    borderColor="rgba(255, 255, 255, 0.3)"
                />
            </HStack> */}
    
               
            </Box>
        </Box>
    </Box>

    )
}
