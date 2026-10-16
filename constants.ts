import { CookingMethod, VeggieSelection } from './types';
import { Carrot, Rat, Sprout, LeafyGreen, CheckCircle2, Circle } from 'lucide-react';

export const MEAT_OPTIONS = [
  'Beef (Topside/Silverside)',
  'Beef (Rib on the bone)',
  'Chicken (Whole)',
  'Lamb (Leg)',
  'Lamb (Shoulder)',
  'Pork (Leg/Loin)',
  'Pork (Shoulder)',
  'Turkey (Whole)',
  'Gammon/Ham'
];

export const VEGGIE_OPTIONS: VeggieSelection[] = [
  { 
    id: 'potatoes', 
    name: 'Roast Potatoes', 
    selected: true, 
    method: CookingMethod.ROAST, 
    allowedMethods: [CookingMethod.ROAST] 
  },
  { 
    id: 'mashed_potatoes', 
    name: 'Mashed Potatoes', 
    selected: false, 
    method: CookingMethod.MASH, 
    allowedMethods: [CookingMethod.MASH] 
  },
  { 
    id: 'sweet_potatoes', 
    name: 'Sweet Potatoes', 
    selected: false, 
    method: CookingMethod.ROAST, 
    allowedMethods: [CookingMethod.ROAST, CookingMethod.MASH] 
  },
  { 
    id: 'parsnips', 
    name: 'Parsnips', 
    selected: true, 
    method: CookingMethod.ROAST, 
    allowedMethods: [CookingMethod.ROAST, CookingMethod.BOIL] 
  },
  { 
    id: 'carrots', 
    name: 'Carrots', 
    selected: true, 
    method: CookingMethod.BOIL, 
    allowedMethods: [CookingMethod.ROAST, CookingMethod.BOIL] 
  },
  { 
    id: 'broccoli', 
    name: 'Broccoli', 
    selected: true, 
    method: CookingMethod.BOIL, 
    allowedMethods: [CookingMethod.BOIL, CookingMethod.ROAST] 
  },
  { 
    id: 'cauliflower', 
    name: 'Cauliflower', 
    selected: false, 
    method: CookingMethod.BOIL, 
    allowedMethods: [CookingMethod.BOIL, CookingMethod.ROAST] 
  },
  { 
    id: 'sprouts', 
    name: 'Brussels Sprouts', 
    selected: true, 
    method: CookingMethod.ROAST, 
    allowedMethods: [CookingMethod.ROAST, CookingMethod.BOIL] 
  },
  { 
    id: 'asparagus', 
    name: 'Asparagus', 
    selected: false, 
    method: CookingMethod.BOIL, 
    allowedMethods: [CookingMethod.BOIL, CookingMethod.ROAST] 
  },
];

export interface CustomPreset {
  name: string;
  method: CookingMethod;
  durationMinutes: number;
  note?: string;
}

export const CUSTOM_PRESETS: CustomPreset[] = [
  { name: 'Pigs in Blankets', method: CookingMethod.ROAST, durationMinutes: 25, note: 'Turn halfway through.' },
  { name: 'Bread Sauce', method: CookingMethod.HOB, durationMinutes: 15, note: 'Stir regularly so it does not catch.' },
  { name: 'Cheese Sauce', method: CookingMethod.HOB, durationMinutes: 10, note: 'Stir constantly.' },
  { name: 'Red Cabbage', method: CookingMethod.HOB, durationMinutes: 30 },
  { name: 'Peas', method: CookingMethod.BOIL, durationMinutes: 5 },
  { name: 'Green Beans', method: CookingMethod.BOIL, durationMinutes: 8 },
  { name: 'Leeks', method: CookingMethod.BOIL, durationMinutes: 10 },
  { name: 'Cauliflower Cheese', method: CookingMethod.ROAST, durationMinutes: 25 },
];
