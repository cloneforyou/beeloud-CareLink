import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  IconButton,
  Text,
  HStack,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

import { motion } from "framer-motion";
import {
  FaPlus,
  FaMicrophone,
  FaEdit,
  FaTrash,
  FaBolt,
  FaUpload,
  FaFile,
} from "react-icons/fa";
import Sidebar from "../components/sidebar";
import { useRouter } from "next/router";
import ReactAudioPlayer from "react-audio-player";
import { MdDelete } from "react-icons/md";

const MotionBox = motion(Box);
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

const AddVoicePage = () => {
  const router = useRouter();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [voices, setVoices] = useState([]);

  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [email, setEmail] = useState();

  const fileInputRef = useRef(null);
  const bgGradient = useColorModeValue(
    "linear(to-r, teal.50, green.50, blue.50)",
    "linear(to-r, gray.800, gray.700, gray.600)"
  );

  const openModal = () => {
    if (voices.length >= 2) {
      console.log("You can upload only two voices.");
      toast({
        title: "Error",
        description: "As Alpha user, You can only clone / upload two voices!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setFiles([]);
    clearCanvas();
    setIsRecording(false);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const startRecording = async () => {
    setIsRecording(true);
  };

  const [AudioFile, setAudioFile] = useState();
  const [cloning, setCloning] = useState(false);

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleAddVoice = async () => {
    if (voices.length >= 2) {
      console.log("You can upload only two voices.");
      toast({
        title: "Error",
        description: "As Alpha user, You can only clone / upload two voices!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (files.length > 0) {
      try {
        const form = new FormData();
        form.append("name", name ? name : "Voice");
        form.append("files", files[0]);
        form.append(
          "description",
          description ? description : "No description provided."
        );
        // form.append("labels", "audio");

        const options = {
          method: "POST",
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: form,
        };

        // options.body = form;
        setCloning(true);

        const response = await fetch(
          "https://api.elevenlabs.io/v1/voices/add",
          options
        );
        const data = await response.json();

        const voiceData = {
          action: "updateVoice",
          email: email,
          voices: {
            voice_id: data?.voice_id,
            voiceName: name ? name : "Voice",
            voiceDescription: description
              ? description
              : "No description provided.",
          },
        };

        fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(voiceData),
        })
          .then((response) => response.json())
          .then((data) => console.log("New user added:", data))
          .catch((error) => console.error("Error adding user:", error));

        toast({
          title: "Success",
          description: "You have cloned / uploaded up successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        clearCanvas();
        await fetchUsers();

        closeModal();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error fetching users!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.error("Error fetching users:", error);
      } finally {
        setCloning(false);
        setFiles([]);
        // router.reload();
      }
    }
  };
  const handleRemoveVoice = async (voiceID, id) => {
    console.log(voiceID);

    try {
      const options = {
        method: "DELETE",
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      };

      fetch(`https://api.elevenlabs.io/v1/voices/${voiceID}`, options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));

      const voiceData = {
        action: "removeVoice",
        email: email,
        voices: {
          _id: id,
          voice_id: voiceID,
          voiceName: name,
          voiceDescription: description,
        },
      };
      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voiceData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("voice removed:", data);

          toast({
            title: "Success",
            description: "You delete successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          router.reload();
        })
        .catch((error) => console.error("Error adding user:", error));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleIDVoice = async (voiceID) => {
    console.log(voiceID);
    if (!voiceID) return;
    toast({
      title: "Voice ID",
      description: `ID: ${voiceID}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const [files, setFiles] = useState([]);
  const handleFileUpload = (event) => {
    console.log("files");
    const files = event.target.files;
    console.log("filesArray");
    const filesArray = Array.from(files);
    console.log(filesArray);
    if (files.length > 0) {
      setFiles(files);

      // Handle the file upload logic here
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleRemoveFiles = () => {
    setFiles([]);
  };

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      const email = localStorage.getItem("email");
      const user = data.find((user) => user.email === email);
      console.log(user.voices);
      setEmail(email);
      setVoices(user.voices);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const recorderControls = useVoiceVisualizer();
  const { recordedBlob, error, audioRef, clearCanvas } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
    if (!recordedBlob) return;

    const fileName = "recorded_audio.mp3";
    const file = new File([recordedBlob], fileName, {
      type: recordedBlob.type,
    });
    setFiles([file]);
  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

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
        <Box textAlign="center" mb={6}>
          <Heading as="h2" size="xl" mb={2}>
            Add/Clone Voice
          </Heading>
          <Text fontSize="md">
            Here you can add the voices that are helpful for the patients, all
            the voices stored here are visible in the Text to Speech page.
          </Text>
        </Box>

        {/* {typeof window !== "undefined" && ( */}
        <MotionBox
          as="button"
          w="300px"
          h="150px"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
          mb={4}
        >
          <FaPlus size="40px" color="gray.500" />
          <Text mt={2} fontSize="md">
            Add Generative or Cloned Voice
          </Text>
          <Text mt={2} fontSize="md">
            {voices?.length} / 2
          </Text>
        </MotionBox>
        {/* )} */}

        {/* Voice Cards */}
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          w="full"
          maxW="1200px"
        >
          {voices.map((voice) => (
            <GridItem key={voice._id} w="100%">
              <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                <HStack justify="space-between">
                  <Box>
                    <HStack>
                      <FaBolt />
                      <Text fontWeight="bold" fontSize="lg">
                        {voice.voiceName}
                      </Text>
                    </HStack>
                    <Text>{voice.voiceDescription}</Text>
                  </Box>
                  <Button
                    size="sm"
                    onClick={() => handleIDVoice(voice.voice_id)}
                  >
                    ID
                  </Button>
                </HStack>
                <HStack mt={4} justify="space-between">
                  {/* <Button size="sm" leftIcon={<FaMicrophone />}>
                    Use
                  </Button> */}
                  <Button size="sm" leftIcon={<FaEdit />}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<FaTrash />}
                    onClick={() => handleRemoveVoice(voice.voice_id, voice._id)}
                  >
                    Remove
                  </Button>
                </HStack>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Flex>

      {/* Add Voice Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Voice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
              <Box
                w="full"
                h="300px"
                border="2px dashed gray"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                // cursor="pointer"
                // onClick={triggerFileInput}
              >
                <VStack>
                  {!isRecording && (
                    <>
                      <Box gap="10px" display="flex">
                        <IconButton
                          icon={<FaUpload />}
                          aria-label="Upload"
                          variant="outline"
                          size="lg"
                          onClick={triggerFileInput}
                        />
                        {files.length > 0 && (
                          <IconButton
                            icon={<MdDelete />}
                            aria-label="Upload"
                            variant="outline"
                            size="lg"
                            onClick={handleRemoveFiles}
                          />
                        )}
                      </Box>

                      {files.length > 0 ? (
                        <Text>
                          File selected: <b>{files[0]?.name}</b>
                        </Text>
                      ) : (
                        <>
                          <Text>Click to upload a file or drag and drop</Text>
                          <Text>Audio files, up to 10MB each</Text>
                        </>
                      )}
                      <Text>OR</Text>
                    </>
                  )}
                  <Button
                    leftIcon={isRecording ? <FaFile /> : <FaMicrophone />}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? "Clone File" : "Record Audio"}
                  </Button>
                  {isRecording && (
                    <VoiceVisualizer
                      ref={audioRef}
                      controls={recorderControls}
                      height={"100px"}
                      width={"300px"}
                      mainBarColor="teal"
                      secondaryBarColor="black"
                      isDownloadAudioButtonShown
                      // isControlPanelShown
                    />
                  )}

                  {/* {AudioFile && (
                    <ReactAudioPlayer
                      src={AudioFile}
                      autoPlay={true}
                      controls
                    />
                  )} */}
                </VStack>
                <Input
                  type="file"
                  accept=".mp3"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />

                {/* <button onClick={convertBlobToMP3}>Convert to MP3</button> */}
              </Box>
              <Box>
                {/* <Text>Samples 0 / 25</Text> */}
                <Box bg="gray.100" p={4} borderRadius="md">
                  {/* <Text>
                    No items uploaded yet. Upload audio samples of the voice you
                    would like to clone.
                  </Text> */}
                  <Text>
                    Sample quality is more important than quantity. Noisy
                    samples may give bad results. Providing more than 5 minutes
                    of audio in total brings little improvement.
                  </Text>
                </Box>
              </Box>
              <Textarea
                placeholder='How would you describe the voice? e.g. "An old American male voice with a slight hoarseness in his throat. Perfect for news."'
                onChange={(e) => setDescription(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isDisabled={cloning}
              onClick={handleAddVoice}
            >
              {cloning ? "Cloning & Uploading..." : "Add Voice"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddVoicePage;
