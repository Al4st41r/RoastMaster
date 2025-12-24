import React, { useState } from 'react';
import { OvenType, RoastConfig, VeggieSelection, CookingMethod } from '../types';
import { MEAT_OPTIONS, VEGGIE_OPTIONS } from '../constants';
import { ChefHat, Utensils, Thermometer, Info } from 'lucide-react';

interface Props {
  onGenerate: (config: RoastConfig) => void;
  isLoading: boolean;
}

export const SetupForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [meat, setMeat] = useState(MEAT_OPTIONS[0]);
  const [weight, setWeight] = useState(1.5);
  const [ovenType, setOvenType] = useState(OvenType.SINGLE);
  const [veggies, setVeggies] = useState<VeggieSelection[]>(VEGGIE_OPTIONS);
  const [gravy, setGravy] = useState<'Packet' | 'Homemade' | 'None'>('Packet');
  const [stuffing, setStuffing] = useState<'Packet' | 'Homemade' | 'None'>('Packet');

  const handleVeggieToggle = (id: string) => {
    setVeggies(prev => prev.map(v => v.id === id ? { ...v, selected: !v.selected } : v));
  };

  const handleMethodChange = (id: string, method: CookingMethod) => {
    setVeggies(prev => prev.map(v => v.id === id ? { ...v, method } : v));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      meat,
      weightKg: weight,
      ovenType,
      veggies,
      gravy,
      stuffing
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-emerald-900 p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent" />
        <ChefHat className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-serif">Sunday Roast Planner</h1>
        <p className="text-emerald-100 mt-2">Perfect timing for your Great British meal</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* Meat Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 border-b pb-2 border-emerald-100">
            <Utensils className="w-5 h-5" />
            <h2 className="text-xl font-semibold">The Meat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meat Type</label>
              <select 
                value={meat} 
                onChange={(e) => setMeat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              >
                {MEAT_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.5" 
                max="10"
                value={weight} 
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Oven Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 border-b pb-2 border-emerald-100">
            <Thermometer className="w-5 h-5" />
            <h2 className="text-xl font-semibold">The Oven</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${ovenType === OvenType.SINGLE ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}>
              <input 
                type="radio" 
                name="oven" 
                value={OvenType.SINGLE} 
                checked={ovenType === OvenType.SINGLE}
                onChange={() => setOvenType(OvenType.SINGLE)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-3 font-medium text-gray-800">Single Oven</span>
            </label>
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${ovenType === OvenType.MULTI ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}>
              <input 
                type="radio" 
                name="oven" 
                value={OvenType.MULTI} 
                checked={ovenType === OvenType.MULTI}
                onChange={() => setOvenType(OvenType.MULTI)}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-3 font-medium text-gray-800">Multiple Ovens</span>
            </label>
          </div>
        </section>

        {/* Vegetables Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 border-b pb-2 border-emerald-100">
            <div className="w-5 h-5 flex items-center justify-center">🥕</div>
            <h2 className="text-xl font-semibold">Vegetables & Sides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {veggies.map((veg) => (
              <div 
                key={veg.id} 
                className={`p-3 rounded-xl border transition-all ${veg.selected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-gray-50 opacity-70'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{veg.name}</span>
                  <input 
                    type="checkbox" 
                    checked={veg.selected} 
                    onChange={() => handleVeggieToggle(veg.id)}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                </div>
                {veg.selected && veg.allowedMethods.length > 1 && (
                  <select 
                    value={veg.method}
                    onChange={(e) => handleMethodChange(veg.id, e.target.value as CookingMethod)}
                    className="w-full text-xs p-1 border border-emerald-200 rounded bg-white text-gray-700"
                  >
                    {veg.allowedMethods.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
                {veg.selected && veg.allowedMethods.length === 1 && (
                  <span className="text-xs text-gray-500 block px-1">{veg.method}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Extras */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-emerald-800 border-b pb-2 border-emerald-100">
            <Info className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Extras</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gravy</label>
              <div className="flex gap-2">
                 {(['Packet', 'Homemade', 'None'] as const).map(opt => (
                   <button
                    key={opt}
                    type="button"
                    onClick={() => setGravy(opt)}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${gravy === opt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                   >
                     {opt}
                   </button>
                 ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stuffing</label>
              <div className="flex gap-2">
                 {(['Packet', 'Homemade', 'None'] as const).map(opt => (
                   <button
                    key={opt}
                    type="button"
                    onClick={() => setStuffing(opt)}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${stuffing === opt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                   >
                     {opt}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </section>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 text-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              Calculating Schedule...
            </>
          ) : (
            'Generate Cooking Plan'
          )}
        </button>
      </form>
    </div>
  );
};
