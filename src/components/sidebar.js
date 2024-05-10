import { useState } from 'react';
import { Box, Flex, IconButton, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Text, useColorModeValue, Button, HStack, Image, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaBars, FaSignOutAlt, FaMicrophone, FaUser, FaBook, FaShieldAlt } from 'react-icons/fa';
import { BsSoundwave } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { HiTranslate } from "react-icons/hi";
import { useRouter } from 'next/router';

const MotionBox = motion(Box);
const MotionText = motion(Text);

const Sidebar = ({ userEmail }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const bgGradient = useColorModeValue('linear(to-r, teal.50, green.50, blue.50)', 'linear(to-r, gray.800, gray.700, gray.600)');
  const router = useRouter();

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const sidebarVariants = {
    expanded: {
      width: '240px',
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    },
    collapsed: {
      width: '60px',
      transition: {
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  };

  const textVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <>
      {/* Side Navigation for Desktop */}
      <MotionBox
        display={{ base: 'none', lg: 'block' }}
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
        bg="white"
        boxShadow="md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <VStack spacing={4} align="start" pt={4} h="full" justify="space-between">
          <Box pl={4} textAlign="center">
            <HStack spacing={4}>
              <Image src="/logo.png" alt="CareLink Logo" boxSize="45px" />
              <MotionText
                variants={textVariants}
                animate={isExpanded ? 'visible' : 'hidden'}
                fontSize="xl" // Increased font size from "lg" to "xl"
                fontWeight="extrabold" // Changed from "bold" to "extrabold"
                ml={-3}
                color="black" // Optional: Ensure the color is bold and stands out
                textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              >
                CareLink
              </MotionText>
            </HStack>
          </Box>
          <VStack spacing={4} align="start" pl={4} w="full">
            <Box textAlign="center" onClick={() => router.push('/add-voice')} cursor="pointer" w="full">
              <HStack spacing={4}>
                <IconButton
                  icon={<MdRecordVoiceOver size="1.4em"/>}
                  aria-label="Add Voice"
                  bg="white"
                  _hover={{ bg: 'gray.100' }}
                />
                <MotionText
                  variants={textVariants}
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  Add Voice
                </MotionText>
              </HStack>
            </Box>
            <Box textAlign="center" onClick={() => router.push('/text-to-speech')} cursor="pointer" w="full">
              <HStack spacing={4}>
                <IconButton
                  icon={<BsSoundwave size="1.4em"/>}
                  aria-label="Another Page"
                  bg="white"
                  _hover={{ bg: 'gray.100' }}
                />
                <MotionText
                  variants={textVariants}
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  Text to Speech
                </MotionText>
              </HStack>
            </Box>
            <Box textAlign="center" onClick={() => router.push('/translator')} cursor="pointer" w="full">
              <HStack spacing={4}>
                <IconButton
                  icon={<HiTranslate size="1.4em"/>}
                  aria-label="Translator"
                  bg="white"
                  _hover={{ bg: 'gray.100' }}
                />
                <MotionText
                  variants={textVariants}
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  Translator
                </MotionText>
              </HStack>
            </Box>
          </VStack>
          <VStack spacing={4} align="start" pl={4} w="full" mb={4}>
            <Box textAlign="center" onClick={() => router.push('/terms')} cursor="pointer" w="full">
              <HStack spacing={4}>
                <IconButton
                  icon={<FaBook />}
                  aria-label="Terms"
                  bg="white"
                  _hover={{ bg: 'gray.100' }}
                />
                <MotionText
                  variants={textVariants}
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  Terms
                </MotionText>
              </HStack>
            </Box>
            <Box textAlign="center" onClick={() => router.push('/privacy')} cursor="pointer" w="full">
              <HStack spacing={4}>
                <IconButton
                  icon={<FaShieldAlt />}
                  aria-label="Privacy"
                  bg="white"
                  _hover={{ bg: 'gray.100' }}
                />
                <MotionText
                  variants={textVariants}
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  Privacy
                </MotionText>
              </HStack>
            </Box>
            <Menu>
              <MenuButton>
                <HStack spacing={4}>
                  <IconButton
                    icon={<FaUser />}
                    aria-label="My Account"
                    bg="white"
                    _hover={{ bg: 'gray.100' }}
                  />
                  <MotionBox
                    variants={textVariants}
                    animate={isExpanded ? 'visible' : 'hidden'}
                  >
                    <VStack align="start" spacing={0}>
                      <Text>My Account</Text>
                      <Text fontSize="sm" color="gray.500">{userEmail}</Text>
                    </VStack>
                  </MotionBox>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaSignOutAlt />} onClick={() => router.push('/login')}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </VStack>
        </VStack>
      </MotionBox>

      {/* Drawer for Mobile */}
      <Drawer isOpen={isDrawerOpen} placement="left" onClose={handleDrawerToggle}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody display="flex" flexDirection="column">
              <VStack spacing={4} flex="1">
                <Button w="full" leftIcon={<MdRecordVoiceOver size="1.4em"/>} onClick={() => router.push('/add-voice')}>Add Voice</Button>
                <Button w="full" leftIcon={<BsSoundwave size="1.4em"/>} onClick={() => router.push('/text-to-speech')}>Another Page</Button>
                <Button w="full" leftIcon={<HiTranslate size="1.4em"/>} onClick={() => router.push('/Translator')}>Translator</Button>
              </VStack>
              <VStack spacing={4} mt="auto">
                <Button w="full" leftIcon={<FaBook />} onClick={() => router.push('/terms')}>Terms</Button>
                <Button w="full" leftIcon={<FaShieldAlt />} onClick={() => router.push('/privacy')}>Privacy</Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {/* Header for Mobile */}
      <Flex display={{ base: 'flex', lg: 'none' }} justify="space-between" p={4} bg="white" boxShadow="md" position="fixed" w="full" zIndex={10}>
      <HStack spacing={4}>
        <IconButton icon={<FaBars />} aria-label="Menu" bg="white" _hover={{ bg: 'gray.100' }} onClick={handleDrawerToggle} />
        <Image src="/logo.png" alt="CareLink Logo" boxSize="50px" />
        <Text variants={textVariants}
          animate={isExpanded ? 'visible' : 'hidden'}
          fontSize="xl" // Increased font size from "lg" to "xl"
          fontWeight="extrabold" // Changed from "bold" to "extrabold"
          color="black" // Optional: Ensure the color is bold and stands out
          textShadow="1px 1px 2px rgba(0,0,0,0.3)" ml={-5}>CareLink</Text>
    </HStack>

        <Menu>
          <MenuButton>
            <HStack spacing={4}>
              <IconButton
                icon={<FaUser />}
                aria-label="My Account"
                bg="white"
                _hover={{ bg: 'gray.100' }}
              />
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaSignOutAlt />} onClick={() => router.push('/login')}>
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};

export default Sidebar;