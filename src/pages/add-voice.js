import { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Heading, VStack, useColorModeValue, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, Input, Textarea, IconButton, Text, HStack, Grid, GridItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlus, FaMicrophone, FaEdit, FaTrash, FaBolt, FaUpload } from 'react-icons/fa';
import Sidebar from '../components/sidebar';

const MotionBox = motion(Box);

const AddVoicePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [voices, setVoices] = useState([]);
  const fileInputRef = useRef(null);
  const bgGradient = useColorModeValue("linear(to-r, teal.50, green.50, blue.50)", "linear(to-r, gray.800, gray.700, gray.600)");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVoices = JSON.parse(localStorage.getItem('voices')) || [];
      setVoices(savedVoices);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('voices', JSON.stringify(voices));
    }
  }, [voices]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        setAudioChunks(prev => [...prev, event.data]);
      }
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const addVoice = () => {
    const newVoice = {
      id: voices.length + 1,
      name: "Ali Raza",
      description: "Clone of close family member"
    };
    setVoices([...voices, newVoice]);
    closeModal();
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      console.log('Files selected:', files);
      // Handle the file upload logic here
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Box bgGradient={bgGradient} minH="100vh">
      <Sidebar userEmail="example@example.com" />

      {/* Main Content */}
      <Flex direction="column" align="center" justify="center" minH="100vh" p={4} pt={{ base: '80px', lg: '0' }}>
        <Box textAlign="center" mb={6}>
          <Heading as="h2" size="xl" mb={2}>Add/Clone Voice</Heading>
          <Text fontSize="md">Here you can add the voices that are helpful for the patients, all the voices stored here are visible in the Text to Speech page.</Text>
        </Box>
        
        {typeof window !== 'undefined' && (
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
            <Text mt={2} fontSize="md">Add Generative or Cloned Voice</Text>
          </MotionBox>
        )}

        {/* Voice Cards */}
        <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} w="full" maxW="1200px">
          {voices.map(voice => (
            <GridItem key={voice.id} w="100%">
              <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                <HStack justify="space-between">
                  <Box>
                    <HStack>
                      <FaBolt />
                      <Text fontWeight="bold" fontSize="lg">{voice.name}</Text>
                    </HStack>
                    <Text>{voice.description}</Text>
                  </Box>
                  <Button size="sm">ID</Button>
                </HStack>
                <HStack mt={4} justify="space-between">
                  <Button size="sm" leftIcon={<FaMicrophone />}>Use</Button>
                  <Button size="sm" leftIcon={<FaEdit />}>Edit</Button>
                  <Button size="sm" leftIcon={<FaTrash />}>Remove</Button>
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
              <Input placeholder="Name" />
              <Box
                w="full"
                h="200px"
                border="2px dashed gray"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={triggerFileInput}
              >
                <VStack>
                  <IconButton
                    icon={<FaUpload />}
                    aria-label="Upload"
                    variant="outline"
                    size="lg"
                  />
                  <Text>Click to upload a file or drag and drop</Text>
                  <Text>Audio files, up to 10MB each</Text>
                  <Text>OR</Text>
                  <Button leftIcon={<FaMicrophone />} onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : 'Record Audio'}
                  </Button>
                </VStack>
                <Input
                  type="file"
                  accept=".mp3"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </Box>
              <Box>
                <Text>Samples 0 / 25</Text>
                <Box bg="gray.100" p={4} borderRadius="md">
                  <Text>No items uploaded yet. Upload audio samples of the voice you would like to clone.</Text>
                  <Text>Sample quality is more important than quantity. Noisy samples may give bad results. Providing more than 5 minutes of audio in total brings little improvement.</Text>
                </Box>
              </Box>
              <Box>
                <Text>Labels 0 / 5</Text>
                <Box bg="gray.100" p={4} borderRadius="md">
                  <Text>No labels. Click + to add a first one.</Text>
                </Box>
              </Box>
              <Textarea placeholder='How would you describe the voice? e.g. "An old American male voice with a slight hoarseness in his throat. Perfect for news."' />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button colorScheme="teal" onClick={addVoice}>Add Voice</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddVoicePage;
