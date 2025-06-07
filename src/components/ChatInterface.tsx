import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Send as SendIcon,
  ContentCopy as CopyIcon,
  Add as AddIcon,
  Functions as FunctionsIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import TypingIndicator from './TypingIndicator';
import { alpha } from '@mui/material/styles';
import { Components } from 'react-markdown';
import type { ComponentPropsWithoutRef } from 'react';

interface Topic {
  id: string;
  name: string;
  category: keyof typeof TOPIC_CATEGORIES;
  lastActive: Date;
  messageCount: number;
  isBookmarked: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  hasCode?: boolean;
  topicId?: string;
}

interface ChatInterfaceProps {
  userName: string;
  onNewChat?: () => void;
  onMessageCountChange?: (count: number) => void;
}

const STORAGE_KEY = 'math_gpt_chat_history';

const TOPIC_CATEGORIES = {
  general: { 
    icon: <SchoolIcon />, 
    label: 'General Math',
    description: 'General mathematics help and problem solving',
    color: '#4CAF50',
  },
  arithmetic: { 
    icon: <CalculateIcon />, 
    label: 'Arithmetic',
    description: 'Basic operations, fractions, decimals, percentages',
    color: '#2196F3',
  },
  algebra: { 
    icon: <FunctionsIcon />, 
    label: 'Algebra',
    description: 'Equations, functions, polynomials, matrices',
    color: '#9C27B0',
  },
  calculus: { 
    icon: <FunctionsIcon />, 
    label: 'Calculus',
    description: 'Derivatives, integrals, limits, series',
    color: '#FF9800',
  },
  geometry: { 
    icon: <TimelineIcon />, 
    label: 'Geometry',
    description: 'Shapes, theorems, trigonometry, vectors',
    color: '#F44336',
  },
  statistics: { 
    icon: <ScienceIcon />, 
    label: 'Statistics',
    description: 'Probability, distributions, data analysis',
    color: '#795548',
  },
  discrete: { 
    icon: <SchoolIcon />, 
    label: 'Discrete Math',
    description: 'Logic, sets, combinatorics, number theory',
    color: '#607D8B',
  }
};

const getWelcomeMessage = (userName: string, category: keyof typeof TOPIC_CATEGORIES): Message => ({
  id: 'welcome',
  content: `# Welcome, ${userName}! 👋

I'm your AI-powered mathematical assistant, ready to help you explore and understand mathematics.

## What I can help you with:
• ${TOPIC_CATEGORIES[category].description}
• Step-by-step solutions
• Concept explanations
• Practice problems
• Interactive learning

Feel free to ask any questions about mathematics!`,
  sender: 'ai',
  timestamp: new Date(),
  topicId: 'default'
});

const loadChatHistory = (userName: string): Message[] => {
  try {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (!savedMessages) {
      return [getWelcomeMessage(userName, 'general')];
    }

    const parsed = JSON.parse(savedMessages);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [getWelcomeMessage(userName, 'general')];
    }

    // Validate and convert each message
    const validMessages = parsed.filter((msg: any): msg is Message => {
      return (
        typeof msg === 'object' &&
        msg !== null &&
        typeof msg.id === 'string' &&
        typeof msg.content === 'string' &&
        (msg.sender === 'user' || msg.sender === 'ai') &&
        msg.timestamp !== undefined
      );
    }).map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));

    return validMessages.length > 0 ? validMessages : [getWelcomeMessage(userName, 'general')];
  } catch (error) {
    console.error('Error loading chat history:', error);
    // Clear potentially corrupted data
    localStorage.removeItem(STORAGE_KEY);
    return [getWelcomeMessage(userName, 'general')];
  }
};


type MarkdownParagraphProps = ComponentPropsWithoutRef<'p'> & {
  ordered?: boolean;
};

type MarkdownListProps = ComponentPropsWithoutRef<'ul'> & {
  ordered?: boolean;
  depth?: number;
};

type MarkdownCodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
  className?: string;
  node?: any;  // Add node prop for react-markdown compatibility
};

const useMarkdownComponents = (theme: any, handleCopy: (content: string, event: React.MouseEvent) => void, isStepByStep: boolean): Components => {
  return useMemo(() => ({
    code: function Code(props: MarkdownCodeProps) {
      const { node, inline, className, children, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');
      
      if (inline) {
        return (
          <code
            className={className}
            style={{
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
            {...rest}
          >
            {children}
          </code>
        );
      }

      return (
        <Box sx={{ position: 'relative' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 1,
              mb: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#F5F5F5',
              borderRadius: 1,
              overflowX: 'auto',  // changed from overflow: 'auto'
              '& pre': {
                margin: 0,
                padding: 0,
                backgroundColor: 'transparent',
              },
            }}
          >
            {language && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  color: 'text.secondary',
                  fontFamily: 'monospace',
                }}
              >
                {language}
              </Typography>
            )}
            <code className={className} {...rest}>
              {code}
            </code>
            <Tooltip title="Copy code">
              <IconButton
                size="small"
                onClick={(e) => handleCopy(code, e)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: language ? 48 : 4,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  color: 'text.secondary',
                  '&:hover': {
                    opacity: 1,
                    color: 'primary.main',
                  },
                }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>
      );
    },
    p: function Paragraph(props: MarkdownParagraphProps) {
      const { children, ...rest } = props;
      const content = String(children);
      // Check if the paragraph contains a math equation
      if (content.includes('$') || content.includes('\\[') || content.includes('\\(')) {
        return (
          <Box
            sx={{
              p: 1,
              my: 0.5,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 1,
              overflowX: 'auto',
            }}
            {...rest}
          >
            {children}
          </Box>
        );
      }
      // Check if the paragraph contains an equation
      if (content.includes('=') && !content.includes('===')) {
        return (
          <Box
            sx={{
              p: 1,
              my: 0.5,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 1,
              fontFamily: 'Roboto Mono, monospace',
            }}
            {...rest}
          >
            {children}
          </Box>
        );
      }
      return (
        <Typography
          variant="body1"
          component="p"
          sx={{
            color: 'text.primary',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            mb: 1,
            ...(isStepByStep && content.match(/^\d+\./) && {
              pl: 2,
              borderLeft: `2px solid ${theme.palette.primary.main}`,
              ml: 1,
            }),
          }}
          {...rest}
        >
          {children}
        </Typography>
      );
    },
    ul: function UnorderedList(props: MarkdownListProps) {
      const { children, ...rest } = props;
      return (
        <Box
          component="ul"
          sx={{
            pl: 3,
            mb: 2,
            '& li': {
              mb: 1,
              color: 'text.primary',
            },
          }}
          {...rest}
        >
          {children}
        </Box>
      );
    },
    ol: function OrderedList(props: MarkdownListProps) {
      const { children, ...rest } = props;
      return (
        <Box
          component="ol"
          sx={{
            pl: 3,
            mb: 2,
            '& li': {
              mb: 1,
              color: 'text.primary',
            },
          }}
          {...rest}
        >
          {children}
        </Box>
      );
    },
  }), [theme, handleCopy, isStepByStep]);
};

// Export the ErrorBoundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            color: 'error.main',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try refreshing the page
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Add type for topic category
type TopicCategory = keyof typeof TOPIC_CATEGORIES;

// Update the helper function with proper typing
const getTopicCategory = (category: string | undefined): TopicCategory => {
  if (category && category in TOPIC_CATEGORIES) {
    return category as TopicCategory;
  }
  return 'general';
};

// Update the Topic interface to use the TopicCategory type
interface Topic {
  id: string;
  name: string;
  category: TopicCategory;
  lastActive: Date;
  messageCount: number;
  isBookmarked: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export default function ChatInterface({ userName, onNewChat, onMessageCountChange }: ChatInterfaceProps) {
  // Initialize state with default values
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return loadChatHistory(userName);
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [getWelcomeMessage(userName, 'general')];
    }
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const savedTopics = localStorage.getItem('math_gpt_topics');
      if (savedTopics) {
        const parsed = JSON.parse(savedTopics);
        return parsed.map((topic: any) => ({
          ...topic,
          lastActive: new Date(topic.lastActive)
        }));
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    }
    return [{
      id: 'default',
      name: 'General Math Help',
      category: 'general',
      lastActive: new Date(),
      messageCount: 0,
      isBookmarked: false,
      difficulty: 'beginner'
    }];
  });

  // Rest of your state declarations
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string>('default');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (onMessageCountChange) {
      onMessageCountChange(messages.length);
    }
  }, [messages, onMessageCountChange]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const lastMessages = messages.slice(-50); // Keep last 50 messages
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lastMessages));
      }
    }
  }, [messages]);

  // Save topics to localStorage
  useEffect(() => {
    localStorage.setItem('math_gpt_topics', JSON.stringify(topics));
  }, [topics]);

  // Update topic message count
  useEffect(() => {
    setTopics(prev => prev.map(topic => ({
      ...topic,
      messageCount: messages.filter(m => m.topicId === topic.id).length,
      lastActive: messages.filter(m => m.topicId === topic.id).length > 0
        ? new Date(Math.max(...messages.filter(m => m.topicId === topic.id).map(m => m.timestamp.getTime())))
        : topic.lastActive
    })));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change or component mounts
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      topicId: currentTopic,
    };

    try {
      setInput('');
      setIsLoading(true);
      setIsTyping(true);
      
      // Update messages state safely
      setMessages(prev => {
        try {
          return [...prev, userMessage];
        } catch (error) {
          console.error('Error updating messages state:', error);
          return prev;
        }
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: input.trim(),
          include_history: true,
          topicId: currentTopic
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data?.response) {
        throw new Error('Invalid response from server');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        topicId: currentTopic,
      };

      // Update messages state safely
      setMessages(prev => {
        try {
          return [...prev, aiMessage];
        } catch (error) {
          console.error('Error updating messages state:', error);
          return prev;
        }
      });
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}`
          : 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        topicId: currentTopic,
      };

      // Update messages state safely
      setMessages(prev => {
        try {
          return [...prev, errorMessage];
        } catch (error) {
          console.error('Error updating messages state:', error);
          return prev;
        }
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleCopy = (content: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(content);
  };

  const renderMessageContent = (message: Message) => {
    if (!message?.content) {
      console.error('Invalid message:', message);
      return (
        <Typography variant="body1" color="error">
          Invalid message format
        </Typography>
      );
    }

    try {
      // User messages are simple text
      if (message.sender === 'user') {
        return (
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </Typography>
        );
      }

      // Welcome message with simpler styling
      if (message.id === 'welcome') {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '60vh', sm: '70vh' },
              width: '100%',
              py: 4,
              px: 2,
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
              components={useMarkdownComponents(theme, handleCopy, false)}
            >
              {message.content}
            </ReactMarkdown>
          </Box>
        );
      }

      // Regular AI messages with fallback
      const isStepByStepMessage = message.content.includes('step-by-step solution') || 
                                 message.content.includes('Here\'s the step-by-step solution');

      return (
        <Box sx={{ position: 'relative' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
            components={useMarkdownComponents(theme, handleCopy, isStepByStepMessage)}
          >
            {message.content}
          </ReactMarkdown>
        </Box>
      );
    } catch (error) {
      console.error('Error rendering message:', error);
      return (
        <Typography
          variant="body1"
          sx={{
            color: 'error.main',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {`Error displaying message: ${error instanceof Error ? error.message : String(error)}. Please try again.`}
        </Typography>
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      setShowNewChatDialog(true);
    }
  };

  const confirmNewChat = () => {
    setMessages([getWelcomeMessage(userName, 'general')]);
    setShowNewChatDialog(false);
  };

  const handleNewTopic = () => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      name: `New ${TOPIC_CATEGORIES.general.label} Topic`,
      category: 'general',
      lastActive: new Date(),
      messageCount: 0,
      isBookmarked: false,
      difficulty: 'beginner'
    };
    setTopics(prev => [...prev, newTopic]);
    setCurrentTopic(newTopic.id);
    setMessages([getWelcomeMessage(userName, newTopic.category)]);
  };

  const handleTopicSelect = (topicId: string) => {
    setCurrentTopic(topicId);
    setIsDrawerOpen(false);
  };

  const handleTopicBookmark = (topicId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, isBookmarked: !topic.isBookmarked }
        : topic
    ));
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategory(prev => prev === category ? null : category);
  };

  const renderSidebar = () => (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 320 },
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Math Topics
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleNewTopic}
          sx={{ 
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          New Topic
        </Button>
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {Object.entries(TOPIC_CATEGORIES).map(([category, { icon, label, description, color }]) => (
          <React.Fragment key={category}>
            <ListItemButton 
              onClick={() => handleCategoryToggle(category)}
              sx={{
                '&:hover': {
                  bgcolor: alpha(color, 0.1),
                },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1, sm: 0 },
                py: { xs: 2, sm: 1 }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                width: { xs: '100%', sm: 'auto' }
              }}>
                <ListItemIcon sx={{ color, minWidth: { xs: 40, sm: 48 } }}>
                  {icon}
                </ListItemIcon>
                <ListItemText 
                  primary={label}
                  secondary={description}
                  primaryTypographyProps={{
                    fontWeight: 600,
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    color: 'text.secondary',
                  }}
                />
              </Box>
              {expandedCategory === category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={expandedCategory === category}>
              <List component="div" disablePadding>
                {topics
                  .filter(topic => topic.category === category)
                  .sort((a, b) => {
                    if (a.isBookmarked !== b.isBookmarked) return b.isBookmarked ? 1 : -1;
                    return b.lastActive.getTime() - a.lastActive.getTime();
                  })
                  .map(topic => (
                    <ListItemButton
                      key={topic.id}
                      selected={currentTopic === topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      sx={{ 
                        pl: { xs: 3, sm: 4 },
                        py: { xs: 2, sm: 1 },
                        '&.Mui-selected': {
                          bgcolor: alpha(color, 0.1),
                          '&:hover': {
                            bgcolor: alpha(color, 0.15),
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: { xs: 40, sm: 48 } }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleTopicBookmark(topic.id, e)}
                          sx={{ 
                            color: topic.isBookmarked ? color : 'text.secondary',
                            '&:hover': {
                              color,
                            },
                          }}
                        >
                          {topic.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText 
                        primary={topic.name}
                        secondary={
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 1, 
                            mt: { xs: 1, sm: 0.5 }
                          }}>
                            <Chip
                              label={topic.difficulty}
                              size="small"
                              sx={{ 
                                height: 20,
                                fontSize: '0.75rem',
                                bgcolor: alpha(color, 0.1),
                                color,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {topic.messageCount} messages
                            </Typography>
                          </Box>
                        }
                      />
                      <Badge
                        badgeContent={topic.messageCount}
                        color="primary"
                        sx={{ 
                          mr: 1,
                          '& .MuiBadge-badge': {
                            bgcolor: color,
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );

  // Add a function to clear history
  const clearHistory = () => {
    setMessages([getWelcomeMessage(userName, 'general')]);
    setTopics([{
      id: 'default',
      name: 'General Math Help',
      category: 'general',
      lastActive: new Date(),
      messageCount: 0,
      isBookmarked: false,
      difficulty: 'beginner'
    }]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('math_gpt_topics');
  };

  // Call clearHistory when the user logs out or re-enters
  useEffect(() => {
    if (!userName) {
      clearHistory();
    }
  }, [userName]);

  return (
    <ErrorBoundary>
      <Box
        component="div"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{
          p: { xs: 1, sm: 2 },
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 0 },
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: { xs: '100%', sm: 'auto' }
          }}>
            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              sx={{ color: 'text.primary' }}
            >
              <SchoolIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {topics.find(t => t.id === currentTopic)?.name || 'Math GPT'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {TOPIC_CATEGORIES[getTopicCategory(topics.find(t => t.id === currentTopic)?.category)].description}
              </Typography>
            </Box>
            <Chip
              label={TOPIC_CATEGORIES[getTopicCategory(topics.find(t => t.id === currentTopic)?.category)].label}
              size="small"
              icon={TOPIC_CATEGORIES[getTopicCategory(topics.find(t => t.id === currentTopic)?.category)].icon}
              sx={{ 
                ml: 1,
                bgcolor: alpha(TOPIC_CATEGORIES[getTopicCategory(topics.find(t => t.id === currentTopic)?.category)].color, 0.1),
                color: TOPIC_CATEGORIES[getTopicCategory(topics.find(t => t.id === currentTopic)?.category)].color,
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewChat}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            New Chat
          </Button>
        </Box>

        {renderSidebar()}

        {/* Chat container */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
          p: { xs: 1, sm: 2 },
          pb: { xs: 7, sm: 8 },
        }}>
          {messages.map((message) => (
            <Fade in={true} key={message.id}>
              <Box sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: 1,
                width: '100%',
              }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    maxWidth: { xs: '90%', sm: '80%' },
                    borderRadius: 2,
                    position: 'relative',
                    background: message.sender === 'user'
                      ? 'linear-gradient(45deg, #6750A4 30%, #625B71 90%)'
                      : theme.palette.mode === 'dark'
                        ? 'linear-gradient(145deg, #2D2B32 0%, #1C1B1F 100%)'
                        : 'linear-gradient(145deg, #F5F5F5 0%, #FFFFFF 100%)',
                    border: `1px solid ${theme.palette.divider}`,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {renderMessageContent(message)}
                </Paper>
              </Box>
            </Fade>
          ))}
          {isTyping && (
            <Fade in={true}>
              <Box sx={{ alignSelf: 'flex-start' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 0,
                    borderRadius: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(145deg, #2D2B32 0%, #1C1B1F 100%)'
                      : 'linear-gradient(145deg, #F5F5F5 0%, #FFFFFF 100%)',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <TypingIndicator />
                </Paper>
              </Box>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input box */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 1, sm: 2 },
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                variant="outlined"
                disabled={isLoading}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!input.trim() || isLoading}
                sx={{
                  borderRadius: 2,
                  height: 40,
                  width: 40,
                  mt: 0.5,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
              </IconButton>
            </Box>
            <Tooltip title="Math equation help">
              <IconButton
                onClick={() => {
                  const helpText = `Math equation help:
• Inline math: $x^2 + y^2 = z^2$
• Display math: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
• Common symbols: \\alpha, \\beta, \\pi, \\infty
• Fractions: \\frac{a}{b}
• Powers: x^2, x^{n+1}
• Subscripts: x_1, x_{i,j}`;
                  setInput(prev => prev + '\n\n' + helpText);
                }}
                sx={{
                  height: 40,
                  width: 40,
                  mt: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <FunctionsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* New Chat Confirmation Dialog */}
        <Dialog
          open={showNewChatDialog}
          onClose={() => setShowNewChatDialog(false)}
        >
          <DialogTitle>Start New Chat?</DialogTitle>
          <DialogContent>
            <Typography>
              This will clear your current chat history. Are you sure you want to start a new chat?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNewChatDialog(false)}>Cancel</Button>
            <Button onClick={confirmNewChat} color="primary" variant="contained">
              Start New Chat
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ErrorBoundary>
  );
}