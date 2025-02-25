"use client"
import { Box, Button, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import colors from '../styles/colors'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {auth} from '../services/firebaseClient'

export default function page() {

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
            height="100vh"
            padding="20px"
        >
            <Box
                width={['90%', '380px']} // Responsivo: 90% da largura em mobile, fixo em 500px para telas maiores
                height="auto"
                padding="20px"
                borderRadius="10px"
            //   boxShadow="lg"
            //   bg="white"
            >
                <Box display="flex" flexDirection="column" width="100%" height="100%">
                    <Text fontSize="25px" textAlign="center" mb="20px">
                        Welcome to TextZap!
                    </Text>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            alignItems: 'center',
                            width: '100%',
                        }}
                        onSubmit={handleLogin}
                    >
                        <Input
                            type="text"
                            placeholder="Email"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="40px"
                            width="100%"
                            maxWidth="400px"
                            padding="10px"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="40px"
                            width="100%"
                            maxWidth="400px"
                            onChange={(e) => setPassword(e.target.value)}
                            padding="10px"
                        />
                        <Button
                            type="submit"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="40px"
                            padding="10px"
                            width="100%"
                            maxWidth="400px"
                            mt={'20px'}
                            bg={colors.default.blue}
                            color="white"
                            _hover={{ bg: 'blue.600' }}
                        >
                            Entrar
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>

    )
}
