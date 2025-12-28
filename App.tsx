import React, { useState } from 'react';
import { SetupForm } from './components/SetupForm';
import { PlanReview } from './components/PlanReview';
import { ActiveTimer } from './components/ActiveTimer';
import { RoastConfig, RoastSchedule } from './types';
import { generateRoastSchedule } from './services/scheduler';

enum AppStep {
  SETUP,
  REVIEW,
  ACTIVE
}

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [config, setConfig] = useState<RoastConfig | null>(null);
  const [schedule, setSchedule] = useState<RoastSchedule | null>(null);
  const [targetTime, setTargetTime] = useState<string>('14:00');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (newConfig: RoastConfig) => {
    setConfig(newConfig);
    setLoading(true);
    try {
      const generatedSchedule = await generateRoastSchedule(newConfig);
      setSchedule(generatedSchedule);
      setStep(AppStep.REVIEW);
    } catch (error) {
      console.error(error);
      alert("Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTimer = (time: string) => {
    setTargetTime(time);
    setStep(AppStep.ACTIVE);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-10">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {step !== AppStep.SETUP && (
            <div className="mb-4 flex justify-end">
                <button 
                  onClick={() => setStep(AppStep.SETUP)}
                  className="text-sm text-gray-500 hover:text-emerald-700"
                >
                  New Roast
                </button>
            </div>
        )}

        {step === AppStep.SETUP && (
          <SetupForm onGenerate={handleGenerate} isLoading={loading} />
        )}
        
        {step === AppStep.REVIEW && schedule && (
          <PlanReview 
            schedule={schedule} 
            onStart={handleStartTimer}
            onBack={() => setStep(AppStep.SETUP)}
          />
        )}

        {step === AppStep.ACTIVE && schedule && (
          <ActiveTimer schedule={schedule} targetTime={targetTime} />
        )}
      </main>
    </div>
  );
};

export default App;
