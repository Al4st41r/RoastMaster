import React, { useState, useEffect } from 'react';
import { OvenType, RoastConfig, VeggieSelection, CookingMethod } from '../types';
import { MEAT_OPTIONS, VEGGIE_OPTIONS, CUSTOM_PRESETS, CustomPreset } from '../constants';
import { ChefHat, Utensils, Thermometer, Info, Plus, X } from 'lucide-react';

interface Props {
  onGenerate: (config: RoastConfig) => void;
  isLoading: boolean;
}

const VegetableIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 451 450" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1,0,0,1,-1779.785928,-630.576904)">
        <path d="M1962.97,895.953C1946.82,881.59 1933.69,865.577 1917.15,851.682C1907.17,868.243 1897.88,883.671 1888.2,899.752C1900.07,911.827 1911.51,923.469 1923.46,935.626C1916.7,942.364 1910.57,948.474 1903.01,956.014C1892.83,945.365 1883.55,935.655 1874.27,925.943C1863.14,940.28 1812.38,1037.47 1809.16,1051.38C1812.87,1049.77 1815.79,1048.64 1818.57,1047.27C1896.3,1008.74 1972.08,966.782 2044.22,918.485C2066.679,903.45 2088.77,887.816 2107.97,868.569C2125.73,850.757 2126.22,827.003 2109.17,808.51C2104.71,803.665 2099.9,799.131 2095.24,794.472C2080.54,779.792 2066.02,764.937 2051.1,750.49C2028.38,728.494 1996.91,737.506 1983.54,761.446C2002.25,780.253 2021.18,799.27 2039.88,818.057C2033.33,824.872 2027.69,830.736 2021.47,837.208C2002.29,819.054 1984.68,800.143 1964.92,781.394C1953.72,797.405 1943.4,812.17 1932.69,827.493C1941.31,836.157 1949.4,844.305 1957.51,852.447C1965.56,860.539 1973.62,868.623 1981.85,876.892C1975.32,883.491 1969.55,889.309 1962.97,895.953ZM2084.62,745.065C2098.59,708.801 2111.95,674.146 2125.65,638.604C2134.04,641.755 2141.91,644.706 2150.95,648.098C2143.23,668.438 2135.7,688.29 2128.36,707.648C2129.05,708.648 2129.18,709.05 2129.44,709.148C2129.69,709.248 2130.08,709.084 2130.39,708.978C2130.69,708.874 2130.99,708.73 2131.25,708.545C2131.79,708.164 2132.35,707.794 2132.81,707.332C2158.29,681.972 2183.76,656.602 2209.24,631.246C2209.46,631.032 2209.84,630.984 2210.82,630.577C2217.94,634.739 2222.6,642.068 2230.13,648.29C2203.1,676.176 2175.47,702.602 2148.95,730.089C2149.33,730.686 2149.72,731.283 2150.1,731.879C2170.21,724.267 2190.32,716.655 2211.23,708.738C2214.66,717.377 2217.67,724.936 2221.17,733.738C2185.77,747.422 2150.68,760.983 2114.47,774.979C2120.6,781.394 2125.7,786.46 2130.49,791.798C2155.67,819.833 2154.63,860.908 2127.84,887.333C2104.72,910.139 2078.21,928.685 2051.23,946.489C1978.75,994.328 1902.99,1036.43 1824.86,1074.29C1820.44,1076.43 1815.8,1078.65 1811.04,1079.43C1789.65,1082.91 1773.54,1061.97 1782.15,1041.56C1787.78,1028.21 1794.45,1015.29 1801.05,1002.38C1829.44,946.875 1859.66,892.397 1892.78,839.564C1912.05,808.823 1931.94,778.47 1955.29,750.616C1962.67,741.811 1970.36,732.988 1979.17,725.707C2004.04,705.163 2041.33,706.108 2065.73,727.199C2071.679,732.338 2077.179,737.996 2084.62,745.065Z" />
    </g>
  </svg>
);

const CUSTOM_KEY = 'roastmaster.customItems';
const METHOD_LABELS: [CookingMethod, string][] = [
  [CookingMethod.ROAST, 'Oven'],
  [CookingMethod.HOB, 'Hob'],
  [CookingMethod.BOIL, 'Boil/Steam'],
];

const loadCustom = (): VeggieSelection[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const SetupForm: React.FC<Props> = ({ onGenerate, isLoading }) => {
  const [meat, setMeat] = useState(MEAT_OPTIONS[0]);
  const [weight, setWeight] = useState(1.5);
  const [doneness, setDoneness] = useState<'Rare' | 'Medium' | 'Well Done'>('Medium');
  const [ovenType, setOvenType] = useState(OvenType.SINGLE);
  const [veggies, setVeggies] = useState<VeggieSelection[]>(() => [...VEGGIE_OPTIONS, ...loadCustom()]);
  const [customName, setCustomName] = useState('');
  const [customMethod, setCustomMethod] = useState(CookingMethod.ROAST);
  const [customMinutes, setCustomMinutes] = useState(20);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(veggies.filter(v => v.isCustom)));
    } catch {
      // storage unavailable; custom items last for this session only
    }
  }, [veggies]);

  const addCustom = (item: CustomPreset) => {
    const name = item.name.trim();
    if (!name || !(item.durationMinutes > 0)) return;
    setVeggies(prev => [...prev, {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      selected: true,
      method: item.method,
      allowedMethods: [item.method],
      isCustom: true,
      durationMinutes: item.durationMinutes,
      note: item.note?.trim() || undefined,
    }]);
  };

  const handleAddFree = () => {
    addCustom({ name: customName, method: customMethod, durationMinutes: customMinutes, note: customNote });
    setCustomName('');
    setCustomNote('');
  };

  const removeCustom = (id: string) => setVeggies(prev => prev.filter(v => v.id !== id));
  const [gravy, setGravy] = useState<'Packet' | 'Homemade' | 'None'>('Packet');
  const [stuffing, setStuffing] = useState<'Packet' | 'Homemade' | 'None'>('Packet');
  const [yorkshires, setYorkshires] = useState<'Packet' | 'Homemade' | 'None'>('Packet');

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
      doneness: meat.includes('Beef') ? doneness : undefined,
      ovenType,
      veggies,
      gravy,
      stuffing,
      yorkshires
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-emerald-900 p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent" />
        <ChefHat className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-3xl font-bold font-serif">Roast Planner</h1>
        <p className="text-emerald-100 mt-2">Perfect timing for your great roast meal</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              >
                {MEAT_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {meat.includes('Beef') && (
              <div className="md:col-span-2 bg-rose-50/50 p-4 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                 <label className="block text-sm font-medium text-rose-900 mb-2">How do you like your Beef?</label>
                 <div className="flex gap-2">
                    {(['Rare', 'Medium', 'Well Done'] as const).map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDoneness(d)}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all ${
                          doneness === d 
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm font-medium' 
                            : 'bg-white text-gray-600 border-rose-200 hover:bg-rose-50'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                 </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.5" 
                max="10"
                value={weight} 
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
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
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${ovenType === OvenType.SINGLE ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-gray-200 hover:border-emerald-400'}`}>
              <input 
                type="radio" 
                name="oven" 
                value={OvenType.SINGLE} 
                checked={ovenType === OvenType.SINGLE}
                onChange={() => setOvenType(OvenType.SINGLE)}
                className="w-4 h-4 text-emerald-700 focus:ring-emerald-600"
              />
              <span className="ml-3 font-medium text-gray-800">Single Oven</span>
            </label>
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${ovenType === OvenType.MULTI ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600' : 'border-gray-200 hover:border-emerald-400'}`}>
              <input 
                type="radio" 
                name="oven" 
                value={OvenType.MULTI} 
                checked={ovenType === OvenType.MULTI}
                onChange={() => setOvenType(OvenType.MULTI)}
                className="w-4 h-4 text-emerald-700 focus:ring-emerald-600"
              />
              <span className="ml-3 font-medium text-gray-800">Multiple Ovens</span>
            </label>
          </div>
        </section>

        {/* Vegetables Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 border-b pb-2 border-emerald-100">
            <VegetableIcon className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Vegetables & Sides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {veggies.map((veg) => (
              <div 
                key={veg.id} 
                className={`p-3 rounded-xl border transition-all ${veg.selected ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-gray-200 bg-gray-50 opacity-70'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{veg.name}</span>
                  {veg.isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCustom(veg.id)}
                      aria-label={`Remove ${veg.name}`}
                      className="ml-auto mr-2 text-gray-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <input 
                    type="checkbox" 
                    checked={veg.selected} 
                    onChange={() => handleVeggieToggle(veg.id)}
                    className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600 border-gray-300"
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
                  <span className="text-xs text-gray-500 block px-1">
                    {veg.isCustom
                      ? `${METHOD_LABELS.find(([m]) => m === veg.method)?.[1] ?? veg.method}, ${veg.durationMinutes} min`
                      : veg.method}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-emerald-300 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quick add</p>
              <div className="flex flex-wrap gap-2">
                {CUSTOM_PRESETS.map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => addCustom(p)}
                    className="px-3 py-1 text-sm rounded-full border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Add your own</p>
              <div className="grid grid-cols-2 md:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFree(); } }}
                  placeholder="Item name"
                  maxLength={40}
                  className="col-span-2 md:col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                <select
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value as CookingMethod)}
                  className="md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {METHOD_LABELS.map(([m, label]) => <option key={m} value={m}>{label}</option>)}
                </select>
                <div className="md:col-span-2 flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                    aria-label="Cooking time in minutes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-xs text-gray-500">min</span>
                </div>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Note (optional)"
                  maxLength={80}
                  className="col-span-2 md:col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddFree}
                  disabled={!customName.trim() || customMinutes <= 0}
                  className="col-span-2 md:col-span-12 flex items-center justify-center gap-1 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Add item
                </button>
              </div>
            </div>
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
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${gravy === opt ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
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
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${stuffing === opt ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                   >
                     {opt}
                   </button>
                 ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Yorkshire Puddings</label>
              <div className="flex gap-2">
                 {(['Packet', 'Homemade', 'None'] as const).map(opt => (
                   <button
                    key={opt}
                    type="button"
                    onClick={() => setYorkshires(opt)}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${yorkshires === opt ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
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
