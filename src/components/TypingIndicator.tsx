import { Box, useTheme } from '@mui/material';

interface TypingIndicatorProps {
  color?: string;
}

export default function TypingIndicator({ color }: TypingIndicatorProps) {
  const theme = useTheme();
  const dotColor = color || theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        py: 1,
        px: 2,
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: dotColor,
            opacity: 0.6,
            animation: 'typing 1.4s infinite',
            animationDelay: `${index * 0.2}s`,
            '@keyframes typing': {
              '0%': {
                transform: 'translateY(0)',
                opacity: 0.6,
              },
              '50%': {
                transform: 'translateY(-4px)',
                opacity: 1,
              },
              '100%': {
                transform: 'translateY(0)',
                opacity: 0.6,
              },
            },
          }}
        />
      ))}
    </Box>
  );
} 