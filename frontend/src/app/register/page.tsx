'use client'
import { Box, Text, Input, Button } from '@chakra-ui/react';
import colors from '../styles/colors';
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';


const RegisterPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [username, setUsername] = useState('')
    const router = useRouter();

    const registerFunction = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirm) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/registerUser", {
                email: email,
                password: password,
                username:username
            });

            alert("Usuário registrado com sucesso!");
            router.push('/login')
            console.log("Resposta do servidor:", response.data);
        } catch (error: any) {
            console.error("Erro ao registrar:", error.response?.data || error.message);
            alert(`Erro ao registrar: ${error.response?.data.message || "Erro desconhecido"}`);
        }
    };

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
                width={['90%', '500px']}
                height="auto"
                padding="20px"
                borderRadius="10px"
            >
                <Box display="flex" flexDirection="column" width="100%" height="100%">
                    <Text fontSize="25px" textAlign="center" mb="20px">
                        Crie sua conta no TextZap!
                    </Text>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            alignItems: 'center',
                            width: '100%',
                        }}
                        onSubmit={registerFunction}
                    >

                        <Input
                            type="text"
                            placeholder="Email"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="40px"
                            width="100%"
                            maxWidth="400px"
                            value={email}
                            padding="10px"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                         <Input
                            type="text"
                            placeholder="Nome de usuario"
                            border="1px solid rgba(255, 255, 255, 0.3)"
                            height="40px"
                            width="100%"
                            maxWidth="400px"
                            value={username}
                            padding="10px"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Box display={'flex'} gap={'10px'}>
                            <Input
                                type="password"
                                placeholder="Senha"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                height="40px"
                                width="100%"
                                maxWidth="400px"
                                padding="10px"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                            <Input
                                type="password"
                                placeholder="Confirme sua senha"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                height="40px"
                                width="100%"
                                maxWidth="400px"
                                padding="10px"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}

                            />
                        </Box>
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
                            Registrar
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;
