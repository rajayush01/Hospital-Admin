import { Snackbar, Alert } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function CustomSnackbar({ 
  open, 
  message, 
  severity = 'success', 
  onClose 
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}