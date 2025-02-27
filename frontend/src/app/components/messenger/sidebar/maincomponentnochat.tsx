import colors from '@/app/styles/colors'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { FaRegCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Maincomponentnochat() {
    
    const MotionBox = motion(Box);

    return (
        <Box width="100%" height="100%" display="flex" padding="10px">
            <Box
                width="100%"
                height="100%"
                borderRadius="12px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={8}
                bg={colors.default.bg_primary}
                // boxShadow="md"
                _hover={{
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s ease-in-out'
                }}
            >
                <MotionBox
                    as={FaRegCommentDots}
                    size="60px"
                    color="gray.500"
                    mb={6}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <Text fontSize="2xl" fontWeight="bold" color="gray.600" mb={2}>
                    Nenhum chat selecionado
                </Text>

                <Text fontSize="md" color="gray.500" maxW="300px">
                    Oh! Ta meio vazio aqui né...
                    Selecione um chat para começar a conversar!
                    {/* Você também pode iniciar uma nova conversa usando o botão acima. */}
                </Text>

                <Box
                    mt={8}
                    width="100px"
                    height="4px"
                    borderRadius="full"
                    bg="gray.200"
                />
            </Box>
        </Box>
    )
}
