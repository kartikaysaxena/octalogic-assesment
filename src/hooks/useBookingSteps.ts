import { useState } from 'react';

import dayjs from 'dayjs';

export const useBookingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Personal Information',
    'Number of Wheels',
    'Vehicle Type',
    'Specific Vehicle', 
    'Booking Dates'
  ];

  const handleNext = (
    validateCurrentStep: (step: number) => boolean,
    setError: (error: string | null) => void,
    formData: any
  ) => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    } else {
      // Provide specific error messages for date validation step
      if (currentStep === 4) {
        if (!formData.startDate || !formData.endDate) {
          setError('Please select both start and end dates');
        } else {
          const startDate = dayjs(formData.startDate);
          const endDate = dayjs(formData.endDate);
          const today = dayjs().startOf('day');
          
          if (startDate.isBefore(today)) {
            setError('Start date cannot be in the past. Please select today or a future date.');
          } else if (endDate.isSame(startDate) || endDate.isBefore(startDate)) {
            setError('End date must be after the start date. Please select a later date.');
          } else {
            setError('Please complete the current step before proceeding');
          }
        }
      } else {
        setError('Please complete the current step before proceeding');
      }
    }
  };

  const handleBack = (setError: (error: string | null) => void) => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  const goToSuccessStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  return {
    currentStep,
    steps,
    handleNext,
    handleBack,
    goToSuccessStep,
  };
};
