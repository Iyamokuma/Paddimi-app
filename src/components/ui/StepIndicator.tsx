import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Step {
  id: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    isCompleted && 'bg-brand-500 text-white',
                    isCurrent && 'bg-brand-500 text-white ring-4 ring-brand-500/20',
                    !isCompleted && !isCurrent && 'bg-brand-50 text-brand-300 ring-1 ring-brand-100',
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isCurrent ? 'text-brand-600' : 'text-muted',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-colors',
                    isCompleted ? 'bg-brand-500' : 'bg-brand-100',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
