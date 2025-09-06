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
import { DirectionsCar, TwoWheeler } from '@mui/icons-material';
import type { BookingFormData, VehicleType } from '../../types';

interface VehicleTypeStepProps {
  formData: BookingFormData;
  onInputChange: (field: keyof BookingFormData, value: any) => void;
  vehicleTypes: VehicleType[];
  loading: boolean;
  showWheelsSelection?: boolean;
}

const VehicleTypeStep: React.FC<VehicleTypeStepProps> = ({ 
  formData, 
  onInputChange, 
  vehicleTypes, 
  loading,
  showWheelsSelection = false
}) => {
  if (showWheelsSelection || formData.wheels === null) {
    // Show wheels selection
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
          Number of wheels
        </Typography>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={formData.wheels || ''}
            onChange={(e) => onInputChange('wheels', parseInt(e.target.value))}
            sx={{ 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'center',
              gap: 2 
            }}
          >
            <Card sx={{ flex: 1, cursor: 'pointer' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TwoWheeler sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
                      <Typography variant="h6">2 Wheels</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Motorcycles & Bikes
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </CardContent>
            </Card>
            
            <Card sx={{ flex: 1, cursor: 'pointer' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <FormControlLabel
                  value={4}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <DirectionsCar sx={{ fontSize: 48, mb: 1, color: 'primary.main' }} />
                      <Typography variant="h6">4 Wheels</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cars & SUVs
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
              </CardContent>
            </Card>
          </RadioGroup>
        </FormControl>
      </Box>
    );
  }

  // Show vehicle type selection
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Type of vehicle
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={formData.vehicleTypeId || ''}
            onChange={(e) => onInputChange('vehicleTypeId', parseInt(e.target.value))}
            sx={{ gap: 2 }}
          >
            {vehicleTypes.map((type) => (
              <Card key={type.id} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <FormControlLabel
                    value={type.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6">{type.name}</Typography>
                        <Chip
                          label={`${type.wheels} wheels`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
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

export default VehicleTypeStep;
