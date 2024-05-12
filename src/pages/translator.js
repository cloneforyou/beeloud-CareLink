import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Sidebar from "../components/sidebar";

const MotionBox = motion(Box);

const TranslatorPage = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.50, green.50, blue.50)",
    "linear(to-r, gray.800, gray.700, gray.600)"
  );

  return (
    <Box bgGradient={bgGradient} minH="100vh">
      <Sidebar userEmail={"email"} />

      {/* Main Content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        p={4}
        pt={{ base: "80px", lg: "0" }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading as="h2" size="xl" mb={6}>
            Translator
          </Heading>
          <Text mb={6}>Stay Tuned... </Text>
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default TranslatorPage;
