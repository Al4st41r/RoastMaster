import React, { useEffect, useState, useRef } from 'react';
import { RoastSchedule, CookingStep } from '../types';
import { CheckCircle2, Circle, Bell, Volume2, Timer } from 'lucide-react';

interface Props {
  schedule: RoastSchedule;
  targetTime: string; // HH:MM
}

export const ActiveTimer: React.FC<Props> = ({ schedule, targetTime }) => {
  const [now, setNow] = useState(new Date());
  // Determine absolute timestamps
  const [steps, setSteps] = useState<(CookingStep & { absoluteTime: Date, completed: boolean, isNext: boolean })[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Calculate target date
    const [hours, minutes] = targetTime.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);
    
    // If target is in the past (e.g. user set 1PM and it's 2PM), assume tomorrow? 
    // Or just let it be negative? For a cooking timer, usually today. 
    // If it's more than 12 hours ago, maybe they meant tomorrow. 
    // Let's assume today for simplicity.

    const mappedSteps = schedule.steps
      .sort((a, b) => b.minutesBeforeServing - a.minutesBeforeServing)
      .map(step => ({
        ...step,
        absoluteTime: new Date(targetDate.getTime() - step.minutesBeforeServing * 60000),
        completed: false,
        isNext: false
      }));

    setSteps(mappedSteps);
    
    // Simple beep sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current = audio;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [schedule, targetTime]);

  // Check for alarms and updates
  useEffect(() => {
    setSteps(currentSteps => {
      let nextFound = false;
      return currentSteps.map((step, idx) => {
        const timeDiff = step.absoluteTime.getTime() - now.getTime();
        const isPast = timeDiff < 0;
        
        // Alarm logic: If we just passed the time (within last second) and it's an alert step
        if (isPast && !step.completed && step.isAlert && Math.abs(timeDiff) < 2000) {
          audioRef.current?.play().catch(e => console.log("Audio play failed", e));
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          new Notification("RoastMaster Step", { body: step.action });
        }

        let isNext = false;
        if (!isPast && !nextFound) {
          isNext = true;
          nextFound = true;
        }

        return { ...step, completed: isPast, isNext };
      });
    });
    
    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

  }, [now]);

  // Find active step index
  const activeStepIndex = steps.findIndex(s => !s.completed);
  const nextStep = steps[activeStepIndex];

  // Calculate time remaining to serving
  const [targetHours, targetMinutes] = targetTime.split(':').map(Number);
  const targetDate = new Date();
  targetDate.setHours(targetHours, targetMinutes, 0, 0);
  const totalRemainingMs = targetDate.getTime() - now.getTime();
  
  const formatTimeRemaining = (ms: number) => {
    if (ms < 0) return "Ready to Serve!";
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* Header / Big Timer */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-xl sticky top-4 z-20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-emerald-200 text-sm font-semibold uppercase tracking-wider">Time until Feast</h2>
            <div className="text-4xl md:text-5xl font-mono font-bold mt-1">
              {formatTimeRemaining(totalRemainingMs)}
            </div>
          </div>
          <Timer className="w-8 h-8 text-emerald-300 opacity-50" />
        </div>
        
        {nextStep && (
          <div className="bg-emerald-800/50 rounded-lg p-4 border border-emerald-700/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-300 text-xs font-bold uppercase">Up Next</span>
              <span className="text-emerald-100 text-xs">at {nextStep.absoluteTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="text-xl font-bold">{nextStep.action}</div>
            <div className="text-emerald-200 text-sm mt-1">in {formatTimeRemaining(nextStep.absoluteTime.getTime() - now.getTime())}</div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
          <span>Schedule</span>
          <span className="text-xs font-normal text-gray-500">Target: {targetTime}</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`p-4 transition-all duration-500 flex gap-4 ${
                step.completed ? 'bg-gray-50 opacity-60 grayscale' : 
                step.isNext ? 'bg-emerald-50 ring-l-4 ring-emerald-500' : 'bg-white'
              }`}
            >
              <div className="flex flex-col items-center min-w-[60px]">
                <div className={`text-sm font-bold ${step.completed ? 'text-gray-400' : 'text-gray-900'}`}>
                  {step.absoluteTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="h-full w-px bg-gray-200 my-2 relative">
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute -left-2.5 top-1/2 -translate-y-1/2 bg-white" />
                  ) : step.isNext ? (
                    <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-white absolute -left-2 top-1/2 -translate-y-1/2 animate-pulse" />
                  ) : (
                    <Circle className="w-3 h-3 text-gray-300 absolute -left-1.5 top-1/2 -translate-y-1/2 bg-white" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold ${step.completed ? 'text-gray-500' : 'text-gray-800'}`}>{step.action}</h3>
                  {step.isAlert && <Bell className="w-3 h-3 text-amber-500" />}
                </div>
                <p className={`text-sm mt-1 ${step.completed ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
              </div>
            </div>
          ))}
          
          {/* Serving Time Endpoint */}
          <div className="p-4 flex gap-4 bg-emerald-50/50">
             <div className="flex flex-col items-center min-w-[60px]">
                <div className="text-sm font-bold text-emerald-900">{targetTime}</div>
                <div className="w-3 h-3 rounded-full bg-emerald-700 mt-auto mb-auto"></div>
             </div>
             <div className="flex-1 flex items-center">
               <span className="font-bold text-emerald-800 text-lg">Serve Dinner! 🍽️</span>
             </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400">
        Don't let the screen sleep!
      </div>
    </div>
  );
};
