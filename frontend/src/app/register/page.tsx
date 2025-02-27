'use client'
import { Box, Text, Input, Button, HStack, Stack, Icon, Link } from '@chakra-ui/react';
import colors from '../styles/colors';
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { HiOutlineUserAdd } from 'react-icons/hi';


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
            const response = await axios.post("https://testezap-backend.vercel.app/api/auth/registerUser", {
                email: email,
                password: password,
                username: username
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
            minHeight="100vh"
            padding="20px"
        >
            <Box
                width={['90%', '500px']}
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
                            as={HiOutlineUserAdd}
                            w={8}
                            h={8}
                            color={colors.default.blue}
                            mb="10px"
                        />
                        <Text fontSize="2xl" fontWeight="bold" color="white">
                            Crie sua conta no TextZap!
                        </Text>
                        <Text fontSize="sm" color="gray.300" mt={1}>
                            Junte-se à nossa comunidade
                        </Text>
                    </Box>

                    <form onSubmit={registerFunction} style={{ width: '100%' }}>
                        <Stack spacing={4}>
                            <Input
                                type="email"
                                placeholder="Email"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                height="45px"
                                color="white"
                                _placeholder={{ color: 'gray.300' }}
                                // focusBorderColor={colors.default.blue}
                                padding={'10px'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                type="text"
                                placeholder="Nome de usuário"
                                border="1px solid rgba(255, 255, 255, 0.3)"
                                height="45px"
                                color="white"
                                _placeholder={{ color: 'gray.300' }}
                                padding={'10px'}
                                // focusBorderColor={colors.default.blue}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <Stack direction={['column', 'row']} spacing={3}>
                                <Input
                                    type="password"
                                    placeholder="Senha"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    height="45px"
                                    padding={'10px'}
                                    color="white"
                                    _placeholder={{ color: 'gray.300' }}
                                    // focusBorderColor={colors.default.blue}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <Input
                                    type="password"
                                    placeholder="Confirme sua senha"
                                    border="1px solid rgba(255, 255, 255, 0.3)"
                                    padding={'10px'}
                                    height="45px"
                                    color="white"
                                    _placeholder={{ color: 'gray.300' }}
                                    // focusBorderColor={colors.default.blue}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                />
                            </Stack>

                            <Button
                                type="submit"
                                height="45px"
                                bg={colors.default.blue}
                                color="white"
                                _hover={{
                                    bg: 'blue.600',
                                    transform: 'translateY(-2px)'
                                }}
                                transition="all 0.2s"
                            >
                                Registrar
                            </Button>
                        </Stack>
                    </form>

                    <HStack justify="center" mt={2}>
                        <Text fontSize="sm" color="gray.300">
                            Já tem conta?{' '}
                            <Link
                                href="/login"
                                color={colors.default.blue}
                                fontWeight="500"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Faça login
                            </Link>
                        </Text>
                    </HStack>


                </Box>
            </Box>
        </Box>
    );
};

export default RegisterPage;
