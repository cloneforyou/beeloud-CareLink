import { useState } from 'react';
import { Box, Container, Heading, VStack, Input, Textarea, Button } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUs = ({ onFocus }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('description', description);

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycby1vawiV0U26X_0YKMzjwd8arDabQAHzIrk6OQJavEuYBa7pOVJCSkhWANS-Nha0gfa/exec', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setSubject('');
        setDescription('');
        setTimeout(() => setSubmitted(false), 3000); // Hide the success message after 3 seconds
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      alert('An error occurred while sending the message');
    }
  };

  return (
    <Box as="section" id="contact" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="container.xl" py={16} textAlign="center">
        <Heading as="h3" size="xl" mb={4}>Contact Us</Heading>
        <VStack spacing={4} align="center" maxW="lg" mx="auto" as="form" onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            size="lg"
            variant="filled"
            value={email}
            onFocus={onFocus}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Subject"
            size="lg"
            variant="filled"
            value={subject}
            onFocus={onFocus}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            size="lg"
            variant="filled"
            value={description}
            onFocus={onFocus}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button colorScheme="teal" size="lg" type="submit">Submit</Button>
        </VStack>
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <Box mt={4} p={4} bg="teal.500" color="white" borderRadius="md">
                Message sent successfully!
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default ContactUs;
