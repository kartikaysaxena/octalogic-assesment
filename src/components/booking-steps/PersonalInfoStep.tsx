import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import type { BookingFormData } from '../../types';

interface PersonalInfoStepProps {
  formData: BookingFormData;
  onInputChange: (field: keyof BookingFormData, value: any) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ formData, onInputChange }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        What is your name?
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) => onInputChange('firstName', e.target.value)}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => onInputChange('lastName', e.target.value)}
          fullWidth
          variant="outlined"
          required
        />
      </Box>
    </Box>
  );
};

export default PersonalInfoStep;
