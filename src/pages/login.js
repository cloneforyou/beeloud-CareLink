// pages/auth.js
import { useState } from 'react';
import { Box, Flex, Heading, Text, Button, Input, VStack, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const MotionBox = motion(Box);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const bgGradient = useColorModeValue("linear(to-r, teal.50, green.50, blue.50)", "linear(to-r, gray.800, gray.700, gray.600)");
  const router = useRouter();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleAuth = () => {
    router.push('/add-voice');
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        width={{ base: '90%', md: '400px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Heading>
        <VStack spacing={4}>
          {!isLogin && (
            <Input placeholder="Name" size="lg" variant="filled" />
          )}
          <Input placeholder="Email" size="lg" variant="filled" type="email" />
          <Input placeholder="Password" size="lg" variant="filled" type="password" />
          {!isLogin && (
            <Input placeholder="Confirm Password" size="lg" variant="filled" type="password" />
          )}
          <Button colorScheme="teal" size="lg" width="full" onClick={handleAuth}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <Text onClick={handleToggle} cursor="pointer" color="teal.500" mt={4}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default AuthPage;
