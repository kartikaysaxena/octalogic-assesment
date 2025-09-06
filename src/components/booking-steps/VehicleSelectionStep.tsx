import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from '@mui/material';
import type { BookingFormData, Vehicle } from '../../types';

interface VehicleSelectionStepProps {
  formData: BookingFormData;
  onInputChange: (field: keyof BookingFormData, value: any) => void;
  vehicles: Vehicle[];
  loading: boolean;
}

const VehicleSelectionStep: React.FC<VehicleSelectionStepProps> = ({ 
  formData, 
  onInputChange, 
  vehicles, 
  loading 
}) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Specific Model
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={formData.vehicleId || ''}
            onChange={(e) => onInputChange('vehicleId', parseInt(e.target.value))}
            sx={{ gap: 2 }}
          >
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <FormControlLabel
                    value={vehicle.id}
                    control={<Radio />}
                    label={
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6">{vehicle.name}</Typography>
                          <Chip
                            label={`₹${vehicle.pricePerDay}/day`}
                            color="secondary"
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.model} • {vehicle.year}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
};

export default VehicleSelectionStep;
