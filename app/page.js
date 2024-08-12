'use client'
import { Box, Stack, TextField, Button, Typography, AccountCircle, Drawer } from "@mui/material";
import { useState, useEffect } from 'react';
import ChatDrawer from "./ChatDrawer/page";

export default function Home() {
  const color1 = "#e5f1f7"
  const [feedbackfield, setFeedbackField] = useState("")
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
  }]);
  const [message, setMessage] = useState('');

  const [isOpen, setIsOpen] = useState(true);

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

  const sendMessage = async (msg = message) => {
    // setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: msg },  // Add the user's message to the chat
      { role: 'assistant', content: '' },  // Add a placeholder for the assistant's response
    ])

    // Send the message to the server
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: getRAGContext(msg) }]),
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

  const handleSendMessage = (newMessage) => {
    // Update the state with the new message
    setMessage(newMessage);
    sendMessage(newMessage)
    // console.log("Message from ChatDrawer:", message);
  };

  const handleFeedbackClick = (msg) =>{
    //Sends feedback
    setFeedbackField("")
  }

  return (
    <Box
      width='100vw'
      height='100vh'
      bgcolor={"#dbecf5"}
      padding={"20px"}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"row"}
      flexWrap={"revert-layer"}
      gap={4}
      overflow={"auto"}
    >
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        height={"100%"}
      >
        <Box
          sx={{
            width: '30vw',
            padding: 2,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Box bgcolor={color1} height={"10vh"}></Box>
          <Box height={"50vh"}>

          </Box>
          <Typography variant="h6">Give Feedback</Typography>
          <TextField
            fullWidth
            multiline
            minRows={"5"}
            value={feedbackfield}
            onChange={(e) => {setFeedbackField(e.target.value)}}
          ></TextField>
          <Button height={"10vh"} fullWidth onClick={handleFeedbackClick}>→</Button>
        </Box>

      </Drawer>
      {/* Drawer Button */}
      <Box
        position={"absolute"}
        top={"20px"}
        left={"0px"}
        width={"5%"}
        height={"95%"}
        bgcolor={"white"}
        borderRadius={"10px"}
        boxShadow={"10"}
      >
        <Button fullWidth onClick={() => setIsOpen(true)}>
          <Typography variant="h3" color={"black"}>☰</Typography>
        </Button>
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
                  <Box display={"flex"} flexWrap={"wrap"} maxWidth={"60%"}
                    color="white"
                    borderRadius={4}
                    p={1}
                    sx={{
                      background: message.role === 'assistant'
                        ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                        : 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                      },
                    }}

                  >
                    <Typography variant="body1" sx={{
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                    }}>
                      {message.content}
                    </Typography>

                  </Box>
                </Box>
              ))
            }
          </Stack>
        </Box>
        <Box maxWidth={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <ChatDrawer onSendMessage={handleSendMessage}></ChatDrawer>
        </Box>
      </Box>
    </Box>
  );
}
