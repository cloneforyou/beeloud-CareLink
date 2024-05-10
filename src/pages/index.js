import { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, Button, Image, VStack, HStack, SimpleGrid, Icon, Container, useColorModeValue, Input, Textarea } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useRouter } from 'next/router';
import ContactUs from '../components/contactUs';

const MotionBox = motion(Box);

const images = [
  '/record.png',
  '/saveaudio.png',
  '/texttoaudio.png',
  '/hear.png'
];

const sections = [
  'hero',
  'about',
  'roadmap',
  'testimonials',
  'sponsors',
  'contact'
];

const Home = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const bgGradient = useColorModeValue("linear(to-r, teal.50, green.50, blue.50)", "linear(to-r, gray.800, gray.700, gray.600)");
  const router = useRouter();

  useEffect(() => {
    if (!isAnimating) return;

    const imageInterval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    const sectionInterval = setInterval(() => {
      setSectionIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % sections.length;
        document.getElementById(sections[newIndex])?.scrollIntoView({ behavior: 'smooth' });
        return newIndex;
      });
    }, 8000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(sectionInterval);
    };
  }, [isAnimating]);

  const handleFocus = () => {
    setIsAnimating(false);
  };

  return (
    <Box bgGradient={bgGradient} color="gray.700">
      {/* Header */}
      <Flex as="header" justify="center" align="center" p={4} bg="white" boxShadow="md">
        <Image src="/logo.png" alt="CareLink Logo" boxSize="60px" mr={-2} />
        <Heading as="h1" size="lg" color="teal.500">CareLink</Heading>
      </Flex>

      {/* Hero Section */}
      <Box as="section" id="hero" minH="100vh" display="flex" alignItems="center" justifyContent="center" position="relative">
        <VStack spacing={8} align="center">
          <VStack spacing={4} align="center" maxW="lg" textAlign="center">
            <Heading as="h2" size="2xl" lineHeight="shorter">Revolutionizing Dementia Care with AI</Heading>
            <Text fontSize="lg">Empowering caregivers and improving patient outcomes through advanced voice cloning and AI prompting.</Text>
            <Button colorScheme="teal" size="lg" onClick={() => router.push('/login')}>Get Started</Button>
          </VStack>
          <AnimatePresence mode="wait">
            <MotionBox
              key={imageIndex}
              mt={{ base: 8, md: 0 }}
              ml={{ md: 8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Image src={images[imageIndex]} alt="App Steps" boxSize="400px" />
            </MotionBox>
          </AnimatePresence>
        </VStack>
        <VStack position="fixed" right={4} top="50%" transform="translateY(-50%)" spacing={3}>
          {sections.map((section, index) => (
            <MotionBox
              key={index}
              width={3}
              height={3}
              borderRadius="50%"
              bg={sectionIndex === index ? 'teal.500' : 'gray.300'}
              cursor="pointer"
              onClick={() => {
                setSectionIndex(index);
                document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.2 }}
              position="relative"
            >
              {sectionIndex === index && (
                <MotionBox
                  position="absolute"
                  top={-1}
                  left={-1}
                  right={-1}
                  bottom={-1}
                  borderRadius="50%"
                  border="2px solid teal.500"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                />
              )}
            </MotionBox>
          ))}
        </VStack>
      </Box>

      {/* About Section */}
      <Box as="section" id="about" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="container.xl" py={16} textAlign="center">
          <Heading as="h3" size="xl" mb={4}>About CareLink</Heading>
          <Text fontSize="lg" maxW="3xl" mx="auto">
            CareLink leverages AI and voice cloning to assist caregivers in communicating effectively with dementia patients.
            Our platform provides tools to improve patient engagement, monitor health, and support care coordination.
          </Text>
        </Container>
      </Box>

      {/* Roadmap Section */}
      <Box as="section" id="roadmap" minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <Container maxW="container.xl" py={16}>
          <Heading as="h3" size="xl" mb={4} textAlign="center">Roadmap</Heading>
          <Box position="relative" w="full">
            {/* Horizontal line for larger screens */}
            <Box
              display={{ base: 'none', lg: 'block' }}
              position="absolute"
              top="50%"
              left="0"
              right="0"
              h="10px"
              bgGradient="linear(to-r, purple.500, teal.500)"
              borderRadius="full"
              transform="translateY(-50%)"
              zIndex={0}
            />
            {/* Vertical line for smaller screens */}
            <Box
              display={{ base: 'block', lg: 'none' }}
              position="absolute"
              top="0"
              bottom="0"
              left="50%"
              w="10px"
              bgGradient="linear(to-b, purple.500, teal.500)"
              borderRadius="full"
              transform="translateX(-50%)"
              zIndex={0}
            />
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} zIndex={1} position="relative">
              {[
                { phase: 'Q1', details: 'Core features like voice cloning, prompting, user authentication, and basic dashboard functionalities.' },
                { phase: 'Q2', details: 'Health monitoring, medication reminders, care coordination tools, and educational resources.' },
                { phase: 'Q3', details: 'Advanced AI features, integration with hospital systems, emotion detection, and personalized care plans.' },
                { phase: 'Q4', details: 'Community support, gamification, multi-language support, and additional accessibility enhancements.' },
              ].map(({ phase, details }, index) => (
                <MotionBox
                  key={phase}
                  p={4}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
                >
                  <Flex direction="column" align="center" textAlign="center">
                    <Box
                      width="60px"
                      height="60px"
                      borderRadius="full"
                      bgGradient="linear(to-r, purple.500, teal.500)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mb={4}
                    >
                      <Heading as="h4" size="md" color="white">{phase}</Heading>
                    </Box>
                    <Text fontWeight="bold" mb={2}>Milestone</Text>
                    <Text>{details}</Text>
                  </Flex>
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        </Container>
      </Box>

      {/* Reviews/Testimonials Section */}
      <Box as="section" id="testimonials" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="container.xl" py={16} textAlign="center">
          <Heading as="h3" size="xl" mb={4}>Testimonials</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {[
              { name: 'Jane Doe', review: 'CareLink has transformed the way I care for my mother. The voice cloning feature is a game-changer!' },
              { name: 'Dr. Smith', review: 'This app provides invaluable support for dementia patients and their caregivers.' },
              { name: 'Nurse John', review: 'A must-have tool for any healthcare professional working with dementia patients.' },
            ].map(({ name, review }) => (
              <MotionBox
                key={name}
                p={4}
                bg="gray.50"
                borderRadius="md"
                boxShadow="md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Text fontSize="lg" fontStyle="italic">"{review}"</Text>
                <Text fontWeight="bold" mt={2}>- {name}</Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Technologies Section */}
      <Box as="section" id="technologies" minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="container.xl" py={16} textAlign="center">
        <Heading as="h3" size="xl" mb={20}>Technologies We Use</Heading>
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={8}>
          <Image src="/nextjs.png" alt="Next.js Logo" maxH="50px" mx="auto" objectFit="contain" filter="grayscale(100%)" />
          <Image src="/chakra.png" alt="Chakra UI Logo" maxH="50px" mx="auto" objectFit="contain" filter="grayscale(100%)" />
          <Image src="/mongodb.png" alt="MongoDB Logo" maxH="50px" mx="auto" objectFit="contain" filter="grayscale(100%)" />
          <Image src="/elevenlabs.png" alt="ElevenLabs Logo" maxH="50px" mx="auto" objectFit="contain" filter="grayscale(100%)" />
        </SimpleGrid>
      </Container>
    </Box>

      {/* Contact Us Section */}
      <ContactUs onFocus={handleFocus} />

      {/* Footer */}
      <Box as="footer" py={8} bg="teal.500" color="white">
        <Container maxW="container.xl">
          <Flex direction="column" align="center">
            <HStack spacing={4} mb={4}>
              <Icon as={FaFacebook} boxSize={6} />
              <Icon as={FaTwitter} boxSize={6} />
              <Icon as={FaLinkedin} boxSize={6} />
              <Icon as={FaInstagram} boxSize={6} />
            </HStack>
            <Text>© 2024 CareLink. All rights reserved.</Text>
            <HStack spacing={4}>
              <Text>Privacy Policy</Text>
              <Text>Terms of Service</Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
