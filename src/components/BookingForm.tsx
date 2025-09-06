import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  PersonalInfoStep,
  VehicleTypeStep,
  VehicleSelectionStep,
  BookingDatesStep,
  SuccessStep,
} from './booking-steps/index';
import { useBookingForm, useBookingSteps } from '../hooks';

const BookingForm: React.FC = () => {
  const {
    formData,
    vehicleTypes,
    vehicles,
    selectedVehicle,
    loading,
    error,
    success,
    handleInputChange,
    validateCurrentStep,
    handleSubmit,
    setError,
  } = useBookingForm();

  const {
    currentStep,
    steps,
    handleNext,
    handleBack,
    goToSuccessStep,
  } = useBookingSteps();

  const onNext = () => {
    handleNext(validateCurrentStep, setError, formData);
  };

  const onBack = () => {
    handleBack(setError);
  };

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      goToSuccessStep();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfoStep
            formData={formData}
            onInputChange={handleInputChange}
          />
        );

      case 1:
        return (
          <VehicleTypeStep
            formData={formData}
            onInputChange={handleInputChange}
            vehicleTypes={vehicleTypes}
            loading={loading}
            showWheelsSelection={true}
          />
        );

      case 2:
        return (
          <VehicleTypeStep
            formData={formData}
            onInputChange={handleInputChange}
            vehicleTypes={vehicleTypes}
            loading={loading}
            showWheelsSelection={false}
          />
        );

      case 3:
        return (
          <VehicleSelectionStep
            formData={formData}
            onInputChange={handleInputChange}
            vehicles={vehicles}
            loading={loading}
          />
        );

      case 4:
        return (
          <BookingDatesStep
            formData={formData}
            onInputChange={handleInputChange}
            selectedVehicle={selectedVehicle}
          />
        );

      case 5:
        return (
          <SuccessStep successMessage={success || ''} />
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
            onClick={onBack}
            disabled={currentStep === 0}
            variant="outlined"
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={onSubmit}
              disabled={!validateCurrentStep(currentStep) || loading}
              variant="contained"
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!validateCurrentStep(currentStep)}
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
