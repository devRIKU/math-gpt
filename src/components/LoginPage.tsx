import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  useTheme,
  Fade,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (name.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              borderRadius: 4,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(145deg, #1C1B1F 0%, #2D2B32 100%)'
                : 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #6750A4 30%, #625B71 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Math GPT
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                mb: 3,
              }}
            >
              Your AI-powered mathematical assistant
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Enter your name"
                variant="outlined"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                error={!!error}
                helperText={error}
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #6750A4 30%, #625B71 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7B61D9 30%, #7A7389 90%)',
                  },
                }}
              >
                Start Chatting
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
} 