import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';


function ChatDrawer({onSendMessage}) {
    const color1 = "#e5f1f7"
    const [message, setMessage] = useState('');
    const [drawerHeight, setDrawerHeight] = useState(100); // Initial height
    const textFieldRef = useRef(null);

    const sendMessage = () => {
        // Your sendMessage logic here
        // console.log(message);
        onSendMessage(message);
        setMessage('');
    };

    useEffect(() => {
        if (textFieldRef.current) {
            const scrollHeight = textFieldRef.current.querySelector('textarea').scrollHeight;
            setDrawerHeight(Math.min(Math.max(scrollHeight + 80, 100), 200)); // Min 100px, Max 200px
        }
    }, [message]);

    return (
        <Paper
            elevation={3}
            sx={{
                width: "60%",
                bottom: 0,
                left: 0,
                right: 0,
                height: '77.5px',
                bgcolor: "#F3E9DC",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                transition: 'height 0.3s ease',
                display: 'flex',
                flexDirection: 'row',
                padding: 2,
                pb:0,
            }}
        >
            <TextField
                ref={textFieldRef}
                multiline
                maxRows={5}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
                sx={{
                    bgcolor: 'transparent',
                    borderRadius: 2,
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: 'transparent' },
                    },
                }}
            />
            <Button
                onClick={sendMessage}
                sx={{
                    mb: 2,
                    background: 'transparent',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'action.hover' },
                }}
            >
                <Typography variant="h6">↵</Typography>
            </Button>
        </Paper>
    );
}

export default ChatDrawer;