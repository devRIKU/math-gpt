import { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box,
  Container,
  Paper,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
  useTheme,
} from '@mui/material';
import { 
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import ChatInterface from './components/ChatInterface';
import LoginPage from './components/LoginPage';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const theme = useTheme();
  const [userName, setUserName] = useState<string | null>(() => {
    // Try to get the user's name from localStorage
    return localStorage.getItem('userName');
  });

  const themeProvider = createTheme({
    palette: {
      mode,
      primary: {
        main: '#6750A4',
      },
      secondary: {
        main: '#625B71',
      },
      background: {
        default: mode === 'light' ? '#FEF7FF' : '#1C1B1F',
        paper: mode === 'light' ? '#FFFFFF' : '#1C1B1F',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  const handleLogout = () => {
    setUserName(null);
    localStorage.removeItem('userName');
  };

  if (!userName) {
    return (
      <ThemeProvider theme={themeProvider}>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={themeProvider}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="h1" 
              sx={{ 
                flexGrow: 1,
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              Math GPT
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                mr: 2,
                color: 'text.secondary',
              }}
            >
              Welcome, {userName}
            </Typography>
            <IconButton 
              onClick={toggleColorMode} 
              sx={{ 
                mr: 1,
                color: 'text.primary',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'rotate(180deg)',
                  color: 'primary.main',
                },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton 
              onClick={handleLogout}
              sx={{ 
                color: 'text.primary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateX(4px)',
                  color: 'error.main',
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth="lg" 
          sx={{ 
            flexGrow: 1,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <ChatInterface userName={userName} />
          </Paper>
        </Container>

        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'rotate(90deg) scale(1.1)',
              '& .MuiSvgIcon-root': {
                color: theme.palette.primary.contrastText,
              },
            },
            '& .MuiSvgIcon-root': {
              transition: 'transform 0.2s ease-in-out',
            },
          }}
          onClick={() => {/* Handle new chat */}}
        >
          <AddIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App; 