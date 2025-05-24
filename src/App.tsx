import { useState, useMemo } from 'react';
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
  alpha,
} from '@mui/material';
import { 
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import ChatInterface from './components/ChatInterface';
import LoginPage from './components/LoginPage';
import NewChatDialog from './components/NewChatDialog';

// Material You color tokens
const colorTokens = {
  light: {
    primary: {
      main: '#6750A4',
      light: '#7F67BE',
      dark: '#4F378B',
      container: '#EADDFF',
      onContainer: '#21005E',
    },
    secondary: {
      main: '#625B71',
      light: '#7A7389',
      dark: '#4A4458',
      container: '#E8DEF8',
      onContainer: '#1D192B',
    },
    tertiary: {
      main: '#7D5260',
      light: '#9B6B7A',
      dark: '#5D3B47',
      container: '#FFD8E4',
      onContainer: '#31111D',
    },
    error: {
      main: '#B3261E',
      light: '#DC362E',
      dark: '#8C1D18',
      container: '#F9DEDC',
      onContainer: '#410E0B',
    },
    background: {
      default: '#FFFBFE',
      paper: '#FFFBFE',
      surface: '#FFFBFE',
      surfaceVariant: '#E7E0EC',
      inverse: '#1C1B1F',
    },
    surface: {
      dim: '#F4EFF4',
      bright: '#FFFBFE',
      low: '#F7F2FA',
      high: '#F4EFF4',
    },
    outline: {
      main: '#79747E',
      variant: '#CAC4D0',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
      disabled: '#79747E',
    },
  },
  dark: {
    primary: {
      main: '#D0BCFF',
      light: '#E8DEF8',
      dark: '#B69DF8',
      container: '#4F378B',
      onContainer: '#EADDFF',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#B69DF8',
      container: '#4A4458',
      onContainer: '#E8DEF8',
    },
    tertiary: {
      main: '#EFB8C8',
      light: '#FFD8E4',
      dark: '#D4A4B3',
      container: '#5D3B47',
      onContainer: '#FFD8E4',
    },
    error: {
      main: '#F2B8B5',
      light: '#F9DEDC',
      dark: '#DC362E',
      container: '#8C1D18',
      onContainer: '#F9DEDC',
    },
    background: {
      default: '#1C1B1F',
      paper: '#1C1B1F',
      surface: '#1C1B1F',
      surfaceVariant: '#49454F',
      inverse: '#FFFBFE',
    },
    surface: {
      dim: '#141218',
      bright: '#1C1B1F',
      low: '#141218',
      high: '#2D2C31',
    },
    outline: {
      main: '#938F99',
      variant: '#49454F',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#CAC4D0',
      disabled: '#938F99',
    },
  },
};

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  const [userName, setUserName] = useState<string | null>(() => {
    // Try to get the user's name from localStorage
    return localStorage.getItem('userName');
  });
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  const themeProvider = useMemo(() => createTheme({
    palette: {
      mode,
      ...colorTokens[mode],
      common: {
        black: '#000000',
        white: '#FFFFFF',
      },
      action: {
        active: alpha(colorTokens[mode].text.primary, 0.56),
        hover: alpha(colorTokens[mode].text.primary, 0.04),
        selected: alpha(colorTokens[mode].text.primary, 0.08),
        disabled: alpha(colorTokens[mode].text.primary, 0.38),
        disabledBackground: alpha(colorTokens[mode].text.primary, 0.12),
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
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? colorTokens.dark.surface.dim : colorTokens.light.surface.bright,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark' 
              ? '0px 4px 8px rgba(0, 0, 0, 0.3)' 
              : '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Open Sans',
        'Helvetica Neue',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        fontWeight: 500,
      },
    },
  }), [mode]);

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

  const handleNewChat = () => {
    setIsNewChatDialogOpen(true);
  };

  const handleNewChatConfirm = () => {
    // Clear chat messages
    setHasMessages(false);
    // Additional cleanup if needed
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
            <ChatInterface 
              userName={userName} 
              onNewChat={handleNewChat}
              onMessageCountChange={setHasMessages}
            />
          </Paper>
        </Container>

        <NewChatDialog
          open={isNewChatDialogOpen}
          onClose={() => setIsNewChatDialogOpen(false)}
          onConfirm={handleNewChatConfirm}
          hasMessages={hasMessages}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 