import React, { useState } from 'react';
import { SetupForm } from './components/SetupForm';
import { PlanReview } from './components/PlanReview';
import { ActiveTimer } from './components/ActiveTimer';
import { RoastConfig, RoastSchedule } from './types';
import { generateRoastSchedule } from './services/geminiService';

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
      alert("Failed to generate schedule. Please check your API key and try again.");
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-emerald-800">
             <span>🍖</span> RoastMaster
          </div>
          {step !== AppStep.SETUP && (
            <button 
              onClick={() => setStep(AppStep.SETUP)}
              className="text-sm text-gray-500 hover:text-emerald-600"
            >
              New Roast
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
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
