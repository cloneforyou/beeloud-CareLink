import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const MotionBox = motion(Box);

const AuthPage = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.50, green.50, blue.50)",
    "linear(to-r, gray.800, gray.700, gray.600)"
  );
  const router = useRouter();
  const toast = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const maxCharacters = 2000;

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSigup = async () => {
    try {
      if (users.length >= 30) {
        console.log("no more than 30 users");
        return;
      }
      const userData = {
        action: "create",
        name: name,
        email: email,
        password: password,
        limit: maxCharacters,
        voices: [],
      };

      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("New user added:", data);
          localStorage.setItem("email", email);

          toast({
            title: "Success",
            description: "You have signed up successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          router.push("/add-voice");
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      if (
        users.find((user) => user.email === email && user.password === password)
      ) {
        localStorage.setItem("email", email);
        router.push("/add-voice");
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter your email and password!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <Box
      bgGradient={bgGradient}
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <MotionBox
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="md"
        width={{ base: "90%", md: "400px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h2" size="xl" textAlign="center" mb={6}>
          {isLogin ? "Login" : "Sign Up"}
        </Heading>
        <VStack spacing={4}>
          {!isLogin && (
            <Input
              placeholder="Name"
              size="lg"
              variant="filled"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Input
            placeholder="Email"
            size="lg"
            variant="filled"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            size="lg"
            variant="filled"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLogin ? (
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={handleLogin}
            >
              Login
            </Button>
          ) : (
            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={handleSigup}
            >
              Sign Up
            </Button>
          )}
          <Text onClick={handleToggle} cursor="pointer" color="teal.500" mt={4}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  );
};

export default AuthPage;
