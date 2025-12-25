import React from 'react';
import { RoastSchedule } from '../types';
import { Clock, AlertCircle, PlayCircle, ArrowLeft } from 'lucide-react';

interface Props {
  schedule: RoastSchedule;
  onStart: (targetTime: string) => void;
  onBack: () => void;
}

export const PlanReview: React.FC<Props> = ({ schedule, onStart, onBack }) => {
  const [targetTime, setTargetTime] = React.useState<string>('14:00');

  // Helper to calculate start time based on serving time input
  const calculateStartTime = () => {
    const [hours, minutes] = targetTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    // Subtract duration
    const startDate = new Date(date.getTime() - schedule.totalDurationMinutes * 60000);
    return startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
           <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
             <ArrowLeft className="w-4 h-4" /> Edit
           </button>
           <h2 className="text-2xl font-bold text-gray-800">Your Roast Plan</h2>
           <div className="w-16"></div> {/* Spacer */}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <p className="text-amber-800 text-sm">{schedule.advice}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
             <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Cooking Time</span>
             <div className="flex items-baseline gap-1">
               <span className="text-4xl font-bold text-emerald-700">{Math.floor(schedule.totalDurationMinutes / 60)}</span>
               <span className="text-gray-500">hr</span>
               <span className="text-4xl font-bold text-emerald-700 ml-2">{schedule.totalDurationMinutes % 60}</span>
               <span className="text-gray-500">min</span>
             </div>
           </div>

           <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex flex-col justify-center">
             <label className="block text-emerald-800 font-medium mb-2 text-center">When do you want to eat?</label>
             <input 
               type="time" 
               value={targetTime}
               onChange={(e) => setTargetTime(e.target.value)}
               className="text-3xl font-bold text-center bg-transparent border-b-2 border-emerald-300 focus:border-emerald-600 outline-none text-emerald-900 w-full"
             />
             <div className="mt-2 text-center text-sm text-emerald-700">
                Start cooking at <span className="font-bold">{calculateStartTime()}</span>
             </div>
           </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-700">Sequence Preview</h3>
          <div className="h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
             {schedule.steps.sort((a, b) => b.minutesBeforeServing - a.minutesBeforeServing).map((step, idx) => (
               <div key={idx} className="flex gap-3 p-3 border-b last:border-0 border-gray-100 bg-white first:rounded-t-md last:rounded-b-md">
                 <div className="w-16 text-right font-mono text-gray-400 text-sm pt-1">
                   -{step.minutesBeforeServing}m
                 </div>
                 <div>
                   <div className="font-medium text-gray-800">{step.action}</div>
                   <div className="text-sm text-gray-500">{step.description}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <button 
          onClick={() => targetTime && onStart(targetTime)}
          disabled={!targetTime}
          className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 text-lg transition-transform active:scale-95 ${
            !targetTime 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed transform-none' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <PlayCircle className="w-6 h-6" />
          Start Timer
        </button>
      </div>
    </div>
  );
};
