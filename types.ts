export enum CookingMethod {
  ROAST = 'Roast',
  BOIL = 'Boil/Steam',
  MASH = 'Mash',
  NONE = 'None'
}

export enum OvenType {
  SINGLE = 'Single Oven (Consistent Temp)',
  MULTI = 'Multiple Ovens (Variable Temps)'
}

export interface VeggieSelection {
  id: string;
  name: string;
  selected: boolean;
  method: CookingMethod;
  allowedMethods: CookingMethod[];
}

export interface RoastConfig {
  meat: string;
  weightKg: number;
  doneness?: 'Rare' | 'Medium' | 'Well Done';
  ovenType: OvenType;
  veggies: VeggieSelection[];
  gravy: 'Packet' | 'Homemade' | 'None';
  stuffing: 'Packet' | 'Homemade' | 'None';
  yorkshires: 'Packet' | 'Homemade' | 'None';
  servingTime?: string; // HH:MM format
}

export interface CookingStep {
  minutesBeforeServing: number; // e.g., 120 means 2 hours before serving
  action: string;
  description: string;
  isAlert: boolean;
}

export interface RoastSchedule {
  totalDurationMinutes: number;
  steps: CookingStep[];
  advice: string;
}
