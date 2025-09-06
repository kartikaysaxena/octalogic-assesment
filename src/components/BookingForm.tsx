import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DirectionsCar, TwoWheeler, CheckCircle } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { apiService } from '../services/api';
import { type BookingFormData, type VehicleType, type Vehicle } from '../types/index';

const steps = [
  'Personal Information',
  'Vehicle Type',
  'Specific Vehicle',
  'Specific Model', 
  'Booking Dates'
];

const BookingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    wheels: null,
    vehicleTypeId: null,
    vehicleId: null,
    startDate: null,
    endDate: null,
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicle types when wheels are selected
  useEffect(() => {
    if (formData.wheels) {
      fetchVehicleTypes(formData.wheels);
    }
  }, [formData.wheels]);

  // Fetch vehicles when vehicle type is selected
  useEffect(() => {
    if (formData.vehicleTypeId) {
      fetchVehicles(formData.vehicleTypeId);
    }
  }, [formData.vehicleTypeId]);

  // Get selected vehicle details
  useEffect(() => {
    if (formData.vehicleId) {
      const vehicle = vehicles.find(v => v.id === formData.vehicleId);
      setSelectedVehicle(vehicle || null);
    }
  }, [formData.vehicleId, vehicles]);

  const fetchVehicleTypes = async (wheels: number) => {
    try {
      setLoading(true);
      const types = await apiService.getVehicleTypesByWheels(wheels);
      setVehicleTypes(types);
    } catch (err) {
      setError('Failed to fetch vehicle types');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (typeId: number) => {
    try {
      setLoading(true);
      const vehicleList = await apiService.getVehiclesByType(typeId);
      setVehicles(vehicleList);
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Reset dependent fields when parent selection changes
    if (field === 'wheels') {
      setFormData(prev => ({
        ...prev,
        vehicleTypeId: null,
        vehicleId: null,
      }));
      setVehicleTypes([]);
      setVehicles([]);
    } else if (field === 'vehicleTypeId') {
      setFormData(prev => ({
        ...prev,
        vehicleId: null,
      }));
      setVehicles([]);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(formData.firstName.trim() && formData.lastName.trim());
      case 1:
        return formData.wheels !== null;
      case 2:
        return formData.vehicleTypeId !== null;
      case 3:
        return formData.vehicleId !== null;
      case 4:
        return !!(formData.startDate && formData.endDate);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    } else {
      setError('Please complete the current step before proceeding');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      setError('Please complete all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookingResponse = await apiService.createBooking({
        ...formData,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        wheels: formData.wheels!,
        vehicleTypeId: formData.vehicleTypeId!,
        vehicleId: formData.vehicleId!,
      });

      setSuccess(`Booking confirmed! Total cost: ₹${bookingResponse.booking.totalPrice} for ${bookingResponse.booking.days} days.`);
      setCurrentStep(prev => prev + 1); // Move to success step
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              What is your name?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                fullWidth
                variant="outlined"
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                fullWidth
                variant="outlined"
                required
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              Number of wheels
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={formData.wheels || ''}
                onChange={(e) => handleInputChange('wheels', parseInt(e.target.value))}
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

      case 2:
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
                  onChange={(e) => handleInputChange('vehicleTypeId', parseInt(e.target.value))}
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

      case 3:
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
                  onChange={(e) => handleInputChange('vehicleId', parseInt(e.target.value))}
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

      case 4:
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
                  handleInputChange('startDate', date?.format('YYYY-MM-DD') || null)
                }
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(date: Dayjs | null) => 
                  handleInputChange('endDate', date?.format('YYYY-MM-DD') || null)
                }
                minDate={formData.startDate ? dayjs(formData.startDate).add(1, 'day') : dayjs().add(1, 'day')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
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

      case 5:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Booking Confirmed!
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Vehicle Rental Booking
      </Typography>
      
      <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ minHeight: 400 }}>
        {renderStepContent()}
      </Box>

      {currentStep < 5 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0}
            variant="outlined"
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!validateCurrentStep() || loading}
              variant="contained"
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
              variant="contained"
              size="large"
            >
              Next
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BookingForm;