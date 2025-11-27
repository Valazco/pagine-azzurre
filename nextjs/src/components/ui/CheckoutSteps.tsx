import { Check } from 'lucide-react';

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

export default function CheckoutSteps({ step1, step2, step3, step4 }: CheckoutStepsProps) {
  const stepValues = { step1, step2, step3, step4 };

  return (
    <nav aria-label="Checkout progress" className="py-6">
      <ol className="flex items-center justify-center">
        {steps.map((step, index) => {
          const isActive = stepValues[step.key];
          const isCompleted = steps
            .slice(index + 1)
            .some((s) => stepValues[s.key]);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.key} className="flex items-center">
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${
                      isActive || isCompleted
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium whitespace-nowrap
                    ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`
                    w-12 sm:w-20 md:w-32 h-0.5 mx-2 -mt-6
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
