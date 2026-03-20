'use client';

import { Check } from 'lucide-react';
import {
  StepsNav,
  StepsList,
  StepItem,
  StepContent,
  StepCircle,
  StepNumber,
  StepLabel,
  Connector,
} from './CheckoutSteps.styles';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const steps = [
  { key: 'step1', label: 'Sign-In' },
  { key: 'step2', label: 'Spedizione' },
  { key: 'step3', label: 'Pagamento' },
  { key: 'step4', label: 'Conferma' },
] as const;

export function CheckoutSteps({ step1, step2, step3, step4 }: CheckoutStepsProps) {
  const stepValues = { step1, step2, step3, step4 };

  return (
    <StepsNav aria-label="Checkout progress">
      <StepsList>
        {steps.map((step, index) => {
          const isActive = stepValues[step.key];
          const isCompleted = steps
            .slice(index + 1)
            .some((s) => stepValues[s.key]);
          const isLast = index === steps.length - 1;

          return (
            <StepItem key={step.key}>
              {/* Step Circle & Label */}
              <StepContent>
                <StepCircle $isActive={isActive || isCompleted}>
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <StepNumber>{index + 1}</StepNumber>
                  )}
                </StepCircle>
                <StepLabel $isActive={isActive || isCompleted}>
                  {step.label}
                </StepLabel>
              </StepContent>

              {/* Connector Line */}
              {!isLast && <Connector $isCompleted={isCompleted} />}
            </StepItem>
          );
        })}
      </StepsList>
    </StepsNav>
  );
}

export default CheckoutSteps;
