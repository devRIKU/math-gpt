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
  Alert,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface LoginPageProps {
  onLogin: (name: string) => void;
}

// Blacklisted names (case-insensitive)
const BLACKLISTED_NAMES = [
  'rishap',
  'rishap pal',
  'bishop',
];

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim().toLowerCase();
    
    // Check if name is blacklisted
    if (BLACKLISTED_NAMES.includes(trimmedName)) {
      setIsBlacklisted(true);
      return;
    }

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    onLogin(name.trim());
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError('');
    setIsBlacklisted(false);
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

            {isBlacklisted ? (
              <Alert 
                severity="info" 
                sx={{ 
                  width: '100%',
                  mb: 2,
                  '& .MuiAlert-message': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }
                }}
              >
                You're too smart for it! 😉
              </Alert>
            ) : (
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
                  onChange={handleNameChange}
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
                  endIcon={
                    <SendIcon sx={{ 
                      color: theme.palette.primary.contrastText,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateX(4px)',
                      },
                    }} />
                  }
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #6750A4 30%, #625B71 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7B61D9 30%, #7A7389 90%)',
                      '& .MuiSvgIcon-root': {
                        transform: 'translateX(4px)',
                      },
                    },
                  }}
                >
                  Start Chatting
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
} 