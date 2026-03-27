import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Master Your Money',
    description: 'Track every dollar, manage your accounts, and watch your net worth grow with our intuitive dashboard.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/6a98af50-f80a-44c5-a0a3-35c3420fd93c/onboarding-dashboard-intro-891596ea-1774617482659.webp'
  },
  {
    title: 'Set Smart Goals',
    description: "Whether it's a new house or a vacation, define your financial goals and track your progress in real-time.",
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/6a98af50-f80a-44c5-a0a3-35c3420fd93c/onboarding-goals-intro-cb702afb-1774617482053.webp'
  },
  {
    title: 'Never Miss a Bill',
    description: 'Automate your recurring expenses and set up budgets to keep your spending in check effortlessly.',
    image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/6a98af50-f80a-44c5-a0a3-35c3420fd93c/onboarding-recurring-intro-d815368f-1774617482633.webp'
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-between p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-sm"
        >
          <div className="w-full aspect-square relative rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100 mb-8">
            <img 
              src={STEPS[currentStep].image} 
              alt={STEPS[currentStep].title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-gray-500 leading-relaxed font-medium">
              {STEPS[currentStep].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full flex flex-col items-center gap-8 pb-8">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentStep ? "w-8 bg-indigo-600" : "w-2 bg-gray-200"
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group transition-all active:scale-95"
        >
          {currentStep === STEPS.length - 1 ? (
            <>Get Started <Check className="w-6 h-6" /></>
          ) : (
            <>Next <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </div>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');