import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessStepProps {
  successMessage: string;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ successMessage }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom color="success.main">
        Booking Confirmed!
      </Typography>
      <Alert severity="success" sx={{ mt: 2 }}>
        {successMessage}
      </Alert>
    </Box>
  );
};

export default SuccessStep;
