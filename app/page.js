'use client'
import { Box, Stack, TextField, Button, Typography, AccountCircle, InputAdornment } from "@mui/material";
import { useState } from 'react';


export default function Home() {
  const color1 = "#e5f1f7"
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
  }]);
  const [message, setMessage] = useState('');

  const getRAGContext = async (query) => {
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    }
  }

  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])

    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: getRAGContext(message) }]),
    }).then(async (res) => {
      const reader = res.body.getReader()  // Get a reader to read the response body
      const decoder = new TextDecoder()  // Create a decoder to decode the response text

      let result = ''
      // Function to process the text from the response
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true })  // Decode the text
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]  // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1)  // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },  // Append the decoded text to the assistant's message
          ]
        })
        return reader.read().then(processText)  // Continue reading the next chunk of the response
      })
    })
  }


  return (
    <Box
      width='100vw'
      height='100vh'
      bgcolor={"#dbecf5"}
      padding={"20px"}
      display={"flex"}
      flexDirection={"row"}
      gap={4}
    >
      <Box
        width={"25%"}
        height={"100%"}
        bgcolor={"white"}
        borderRadius={"10px"}
        boxShadow={"10"}
      >
      </Box>
      <Box
        width={"75%"}
        height={"100%"}
        bgcolor={"white"}
        borderRadius={"10px"}
        boxShadow={"10"}
        display={"flex"}
        flexDirection={"column"}
        overflow={"hidden"}
      >
        <Box
          width={"100%"}
          height={"10%"}
          minHeight={"60px"}
          bgcolor={color1}
          padding={"0 20px 0 20px"}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          gap={1}

        >
          <img src="favicon.ico" width={"50px"}></img>
          <Typography variant="h3" color={"black"} fontFamily={"Comic Sans MS, Comic Sans, cursive"} whiteSpace="nowrap">
            BILL AI
          </Typography>
          <Typography variant="h3" color={"black"} fontFamily={"Helvetica"}>
            |
          </Typography>
          <Typography flexWrap={"wrap"} variant="h6" color={"black"} fontFamily={"Comic Sans MS, Comic Sans, cursive"}>
            Headstar AI assistant to assist your needs!
          </Typography>
        </Box>
        <Box
          bgcolor={"white"}
          width={"100%"}
          height={"80%"}
          minHeight={"200px"}
          padding={"20px"}
        >
          <Stack
            direction='column'
            spacing={2}
            width={"100%"}
            overflow={"auto"}
            maxHeight='100%'
          >
            {
              messages.map((message, index) => (
                <Box key={index} alignItems={"center"}
                  display='flex' justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }>
                  <Box display={"flex"} flexWrap={"wrap"} maxWidth={"60%"} bgcolor={
                    message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                  }
                    color='white'
                    borderRadius={4}
                    p={3}
                  >
                    <Typography variant="body1" word-wrap="break-word">
                      {message.content}
                    </Typography>

                  </Box>
                </Box>
              ))
            }
          </Stack>
        </Box>
        <Box
          height={"10%"}
          minHeight={"100px"}
          maxHeight={"140px"}
          width={"100%"}
          padding={"20px"}
          display={"flex"}
          alignItems={"end"}
          justifyContent={"end"}
        >
          <Box
            width={"100%"}
            height={"100%"}
            bgcolor={color1}
            borderRadius={"20px"}
            overflow={"hidden"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <TextField
              multiline
              maxRows={4}
              label='message'
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            >
            </TextField>
            <Button
              onClick={sendMessage}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
