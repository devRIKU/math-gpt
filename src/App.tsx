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
} from '@mui/material';
import { 
  Add as AddIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import ChatInterface from './components/ChatInterface';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  const theme = createTheme({
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

  return (
    <ThemeProvider theme={theme}>
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
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
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
            <ChatInterface />
          </Paper>
        </Container>

        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
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