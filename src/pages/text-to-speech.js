import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  AbsoluteCenter,
  Flex,
  Heading,
  VStack,
  Button,
  Textarea,
  Select,
  Text,
  HStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { ImFilesEmpty } from "react-icons/im";
import Sidebar from "../components/sidebar";
import ReactAudioPlayer from "react-audio-player";
import AudioPlay from "./AudioPlayer";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);
const MotionTextarea = motion(Textarea);
const MotionSelect = motion(Select);

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

const TextToSpeechPage = () => {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [voices, setVoices] = useState([]);
  const [historyVoices, setHistoryVoices] = useState([]);
  const [email, setEmail] = useState();
  const [user, setUser] = useState([]);
  const [maxCharacters, setMaxCharacters] = useState(0);
  const [AudioFile, setAudioFile] = useState();
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const [voice, setVoice] = useState("S74cHu2GGyVqXFRq8lGf");

  const bgGradient = useColorModeValue(
    "linear(to-r, teal.50, green.50, blue.50)",
    "linear(to-r, gray.800, gray.700, gray.600)"
  );

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      const email = localStorage.getItem("email");
      setEmail(email);
      const user = data.find((user) => user.email === email);
      setUser(user);
      setVoices(user.voices);
      setMaxCharacters(user.limit);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async function fetchHistoryVoices() {
    try {
      const options = {
        method: "GET",
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      };

      fetch("https://api.elevenlabs.io/v1/history", options)
        .then((response) => response.json())
        .then((response) => {
          const hisArr = [];
          for (let i of user.voices ?? []) {
            for (let j of response.history ?? []) {
              if (
                j.voice_id === i.voice_id
                //"qRc7Z9htMT4mENPrSkN1"
              )
                hisArr.push(j);
            }
            console.log(hisArr);
          }
          // response?.history?.map((his) => console.log(his?.voice_id));
          setHistoryVoices(hisArr);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchHistoryVoices();
  }, []);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= Number(maxCharacters)) {
      setText(e.target.value);
    }
  };

  const handleVoiceChange = (e) => setSelectedVoice(e.target.value);

  const handleGenerateSpeech = async () => {
    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "You have to select Voice!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsGenerating(true);
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

      const userData = {
        action: "updateLimit",
        email: email,
        limit: Number(maxCharacters) - text.length,
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
          console.log("Generated:", data);
          fetchUsers();
        })
        .catch((error) => console.error("Error adding user:", error));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGenerating(false);
    }

    console.log(
      `Generating speech for text: ${text} with voice: ${selectedVoice}`
    );
  };

  const [tapSelected, setTapselected] = useState("GENERATE");
  ("HISTORY");
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
              <Button
                variant="link"
                size="sm"
                onClick={() => setTapselected("GENERATE")}
              >
                GENERATE
              </Button>
              <Button
                variant="link"
                size="sm"
                onClick={() => setTapselected("HISTORY")}
              >
                HISTORY
              </Button>
            </HStack>
            {tapSelected === "GENERATE" && (
              <>
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
                <HStack justify="end" w="full">
                  <MotionText
                    fontSize={"sm"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {text.length}/{maxCharacters}
                  </MotionText>
                </HStack>
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
                    isDisabled={isGenerating}
                  >
                    {isGenerating ? "Generating.." : "Generate"}
                  </MotionButton>
                </HStack>
                {AudioFile && (
                  <ReactAudioPlayer src={AudioFile} autoPlay={true} controls />
                )}
              </>
            )}
            {tapSelected === "HISTORY" && (
              <Box height={400} overflowY={"auto"}>
                {historyVoices?.length === 0 ? (
                  <MotionBox>
                    <MotionText fontSize={"xl"} align={"center"}>
                      Generated speech will display here
                    </MotionText>
                    <MotionBox
                      height={300}
                      overflowY="auto"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <ImFilesEmpty size={100} color="D3D3D3" />
                    </MotionBox>
                  </MotionBox>
                ) : (
                  <>
                    {historyVoices?.map((hisVoice, i) => {
                      return <AudioPlay key={i} file={hisVoice} />;
                    })}
                  </>
                )}
              </Box>
            )}
          </VStack>
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default TextToSpeechPage;
