import { Spinner, Text, Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function Loading() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="rgba(0, 0, 0, 0.7)"
      backdropFilter="blur(4px)"
      zIndex="9999"
      css={{ animation: `${fadeIn} 0.3s ease-in` }}
    >
      <Box
        textAlign="center"
        p={8}
        borderRadius="lg"
        bg="rgba(255, 255, 255, 0.05)"
        border="1px solid rgba(255, 255, 255, 0.1)"
      >
        <Spinner
          thickness="3px"
          speed="0.65s"
          emptyColor="gray.600"
          color="blue.400"
          width="50px"
          height="50px"
        />
        <Text 
          mt={4} 
          color="gray.300" 
          fontSize="lg" 
          fontWeight="medium"
        >
          Carregando...
        </Text>
      </Box>
    </Box>
  );
}