import { useEffect, useState } from "react";
import { Box, Text, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

import ReactAudioPlayer from "react-audio-player";

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

export default function AudioPlay({ file }) {
  const [AudioFile, setAudioFile] = useState();
  useEffect(() => {
    async function onSubmit() {
      try {
        const options = {
          method: "GET",
          headers: { "xi-api-key": ELEVENLABS_API_KEY },
        };

        const response = await fetch(
          `https://api.elevenlabs.io/v1/history/${file?.history_item_id}/audio`,
          options
        );
        const blob = await response.blob();
        setAudioFile(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error:", error);
      }
    }
    onSubmit();
  }, []);
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      textAlign="center"
      pb={4}
    >
      <Divider />

      <MotionText
        fontSize={"sm"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        '{file.text}'
      </MotionText>
      <ReactAudioPlayer src={AudioFile} controls />
    </MotionBox>
  );
}
