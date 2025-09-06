import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import type { BookingFormData, Vehicle } from '../../types';

interface BookingDatesStepProps {
  formData: BookingFormData;
  onInputChange: (field: keyof BookingFormData, value: any) => void;
  selectedVehicle: Vehicle | null;
}

const BookingDatesStep: React.FC<BookingDatesStepProps> = ({ 
  formData, 
  onInputChange, 
  selectedVehicle 
}) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
        Select booking dates
      </Typography>
      {selectedVehicle && (
        <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Selected Vehicle: <strong>{selectedVehicle.name} {selectedVehicle.model}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Price: ₹{selectedVehicle.pricePerDay} per day
            </Typography>
          </CardContent>
        </Card>
      )}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <DatePicker
          label="Start Date"
          value={formData.startDate ? dayjs(formData.startDate) : null}
          onChange={(date: Dayjs | null) => 
            onInputChange('startDate', date?.format('YYYY-MM-DD') || null)
          }
          minDate={dayjs()}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              error: formData.startDate ? dayjs(formData.startDate).isBefore(dayjs().startOf('day')) : false,
              helperText: formData.startDate && dayjs(formData.startDate).isBefore(dayjs().startOf('day')) 
                ? 'Start date cannot be in the past' 
                : '',
            },
          }}
        />
        <DatePicker
          label="End Date"
          value={formData.endDate ? dayjs(formData.endDate) : null}
          onChange={(date: Dayjs | null) => 
            onInputChange('endDate', date?.format('YYYY-MM-DD') || null)
          }
          minDate={formData.startDate ? dayjs(formData.startDate).add(1, 'day') : dayjs().add(1, 'day')}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              error: formData.endDate && formData.startDate 
                ? (dayjs(formData.endDate).isSame(dayjs(formData.startDate)) || dayjs(formData.endDate).isBefore(dayjs(formData.startDate)))
                : false,
              helperText: formData.endDate && formData.startDate && (dayjs(formData.endDate).isSame(dayjs(formData.startDate)) || dayjs(formData.endDate).isBefore(dayjs(formData.startDate)))
                ? 'End date must be after start date'
                : '',
            },
          }}
        />
      </Box>
      {formData.startDate && formData.endDate && selectedVehicle && (
        <Card sx={{ mt: 3, bgcolor: 'success.50' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Booking Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Duration:</Typography>
              <Typography>
                {Math.ceil((dayjs(formData.endDate).valueOf() - dayjs(formData.startDate).valueOf()) / (1000 * 60 * 60 * 24))} days
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Daily Rate:</Typography>
              <Typography>₹{selectedVehicle.pricePerDay}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total Cost:</Typography>
              <Typography variant="h6" color="primary">
                ₹{Math.ceil((dayjs(formData.endDate).valueOf() - dayjs(formData.startDate).valueOf()) / (1000 * 60 * 60 * 24)) * selectedVehicle.pricePerDay}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BookingDatesStep;
