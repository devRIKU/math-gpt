import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasMessages: boolean;
}

export default function NewChatDialog({ 
  open, 
  onClose, 
  onConfirm,
  hasMessages 
}: NewChatDialogProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="new-chat-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1C1B1F 0%, #2D2B32 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%)',
          border: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <DialogTitle id="new-chat-dialog-title" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6" component="span">
            Start New Chat
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ color: 'text.secondary', mb: 2 }}>
          {hasMessages 
            ? "Starting a new chat will clear your current conversation. Are you sure you want to continue?"
            : "Are you sure you want to start a new chat?"}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="primary"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            background: 'linear-gradient(45deg, #6750A4 30%, #625B71 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #7B61D9 30%, #7A7389 90%)',
            },
          }}
        >
          Start New Chat
        </Button>
      </DialogActions>
    </Dialog>
  );
} 