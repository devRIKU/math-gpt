import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  Divider,
  useTheme,
  Fade,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  userName: string;
}

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: 'welcome',
      content: `Hello ${userName}! 👋 I'm your mathematical assistant. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Add loading message
    const loadingMessage: Message = {
      id: 'loading',
      content: 'Thinking...',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Remove loading message and add actual response
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== 'loading');
        return [...filtered, {
          id: Date.now().toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        }];
      });
    } catch (error) {
      // Remove loading message and add error message
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== 'loading');
        return [...filtered, {
          id: Date.now().toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
        }];
      });
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
      }}>
        <List sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                px: 0,
              }}
            >
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
                maxWidth: '80%',
              }}>
                {message.role === 'assistant' && (
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    M
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: message.role === 'user' 
                      ? 'primary.main' 
                      : theme.palette.mode === 'light'
                        ? 'grey.100'
                        : 'grey.800',
                    color: message.role === 'user' 
                      ? 'primary.contrastText'
                      : 'text.primary',
                    borderRadius: 2,
                    opacity: message.isLoading ? 0.7 : 1,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  {message.isLoading ? (
                    <Typography>{message.content}</Typography>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }: any) {
                          return (
                            <code
                              className={className}
                              style={{
                                backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F5F5F5',
                                padding: inline ? '0.2em 0.4em' : '1em',
                                borderRadius: '4px',
                                display: inline ? 'inline' : 'block',
                                overflowX: 'auto',
                                fontFamily: 'monospace',
                              }}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </Paper>
                {message.role === 'user' && (
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  color: 'text.secondary',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  ml: message.role === 'assistant' ? 5 : 0,
                  mr: message.role === 'user' ? 5 : 0,
                }}
              >
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>

        <Divider />
        
        <Box sx={{ 
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            maxWidth: 'lg',
            mx: 'auto',
          }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a math question..."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
} 