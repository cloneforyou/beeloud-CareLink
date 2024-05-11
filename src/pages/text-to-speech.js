import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  Button,
  Textarea,
  Select,
  Text,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import Sidebar from "../components/sidebar";
import ReactAudioPlayer from "react-audio-player";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionTextarea = motion(Textarea);
const MotionSelect = motion(Select);
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

const TextToSpeechPage = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState([]);
  const [email, setEmail] = useState();

  const [voice, setVoice] = useState("S74cHu2GGyVqXFRq8lGf");

  const bgGradient = useColorModeValue(
    "linear(to-r, teal.50, green.50, blue.50)",
    "linear(to-r, gray.800, gray.700, gray.600)"
  );

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedVoices = JSON.parse(localStorage.getItem('voices')) || [];
  //     setVoices(savedVoices);
  //   }
  // }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        const email = localStorage.getItem("email");
        setEmail(email);
        const user = data.find((user) => user.email === email);
        setVoices(user.voices);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleTextChange = (e) => setText(e.target.value);
  const handleVoiceChange = (e) => setSelectedVoice(e.target.value);
  const [AudioFile, setAudioFile] = useState();

  const handleGenerateSpeech = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: `{"text":"${text}","voice_settings":{"stability":0.5,"similarity_boost":0.5}}`,
      };

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        options
      );
      const blob = await response.blob();
      setAudioFile(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error:", error);
    }

    console.log(
      `Generating speech for text: ${text} with voice: ${selectedVoice}`
    );
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh">
      <Sidebar userEmail={email} />

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
            Text to Speech
          </Heading>
          <Text mb={6}>
            Here you can enter the text that you want to say to patient and
            select the particular voice you want to use for that patient and
            then click generate to play that text.
          </Text>
        </MotionBox>

        <MotionBox
          w="full"
          maxW="lg"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" w="full">
              <Button variant="link" size="sm">
                GENERATE
              </Button>
              <Button variant="link" size="sm">
                HISTORY
              </Button>
            </HStack>
            <MotionTextarea
              placeholder="Enter the text you want to say..."
              value={text}
              onChange={handleTextChange}
              rows={6}
              resize="none"
              focusBorderColor="teal.500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <HStack justify="space-between" w="full">
              <MotionSelect
                placeholder="Select Voice"
                value={selectedVoice}
                onChange={handleVoiceChange}
                focusBorderColor="teal.500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {voices.map((voice) => (
                  <option key={voice._id} value={voice.voice_id}>
                    {voice.voiceName}
                  </option>
                ))}
              </MotionSelect>
              <MotionButton
                leftIcon={<FaPlay />}
                onClick={handleGenerateSpeech}
                colorScheme="teal"
                px={8}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Generate
              </MotionButton>
            </HStack>
            {AudioFile && (
              <ReactAudioPlayer src={AudioFile} autoPlay={true} controls />
            )}
          </VStack>
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default TextToSpeechPage;
