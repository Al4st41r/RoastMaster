import { RoastConfig, RoastSchedule, CookingStep, CookingMethod } from '../types';

const calculateMeatTime = (meat: string, weightKg: number, doneness?: string): number => {
  const weight500g = weightKg * 2;
  
  if (meat.includes('Beef')) {
    if (doneness === 'Rare') return Math.ceil(weight500g * 15 + 20);
    if (doneness === 'Well Done') return Math.ceil(weight500g * 25 + 20);
    return Math.ceil(weight500g * 20 + 20); // Medium (Default)
  }
  if (meat.includes('Chicken')) return Math.ceil(weight500g * 20 + 20);
  if (meat.includes('Lamb')) return Math.ceil(weight500g * 25 + 25);
  if (meat.includes('Pork')) return Math.ceil(weight500g * 30 + 30);
  if (meat.includes('Turkey')) return Math.ceil(weightKg * 20 + 70); 
  if (meat.includes('Gammon')) return Math.ceil(weight500g * 30 + 30);
  
  return Math.ceil(weight500g * 25 + 20); // Fallback
};

const getRestingTime = (meat: string): number => {
  if (meat.includes('Turkey')) return 30;
  if (meat.includes('Beef')) return 20;
  return 15;
};

export const generateRoastSchedule = async (config: RoastConfig): Promise<RoastSchedule> => {
    // Simulate async to keep interface consistent for now, or just return directly.
    // Keeping async allows for easy transition if we ever add async logic back.
    
    const steps: CookingStep[] = [];
    const meatCookingTime = calculateMeatTime(config.meat, config.weightKg, config.doneness);
    const restingTime = getRestingTime(config.meat);
    
    // Meat IN
    // Total time for meat process = cooking + resting.
    // We want meat to be DONE resting at T=0.
    // So Meat finishes cooking at T=restingTime.
    // Meat goes in at T=restingTime + meatCookingTime.
    const meatInTime = meatCookingTime + restingTime;
    
    const meatAction = config.doneness && config.meat.includes('Beef') 
      ? `Put ${config.meat} (${config.doneness}) in oven`
      : `Put ${config.meat} in oven`;

    steps.push({
        minutesBeforeServing: meatInTime,
        action: meatAction,
        description: `Season and place in oven at 180°C/160°C Fan. Cooking for ${meatCookingTime} mins.`,
        isAlert: true
    });

    // Meat OUT
    steps.push({
        minutesBeforeServing: restingTime,
        action: `Take ${config.meat} out`,
        description: `Remove from oven, cover with foil and let rest for ${restingTime} mins.`,
        isAlert: true
    });

    // Veggies
    config.veggies.filter(v => v.selected).forEach(v => {
        if (v.id === 'potatoes' && v.method === CookingMethod.ROAST) {
             steps.push({
                minutesBeforeServing: 70,
                action: 'Prep Roast Potatoes',
                description: 'Peel and parboil potatoes for 10 mins.',
                isAlert: true
             });
             steps.push({
                minutesBeforeServing: 50,
                action: 'Roast Potatoes In',
                description: 'Add potatoes to hot oil/fat in oven.',
                isAlert: true
             });
        } else if (v.id === 'parsnips' && v.method === CookingMethod.ROAST) {
             steps.push({
                minutesBeforeServing: 40,
                action: 'Put Parsnips in oven',
                description: 'Toss in oil/honey and roast.',
                isAlert: true
             });
        } else if (v.method === CookingMethod.ROAST) {
             // Generic roast veg (carrots, sprouts, etc if roasted)
             steps.push({
                minutesBeforeServing: 30,
                action: `Put ${v.name} in oven`,
                description: `Toss in oil and roast.`,
                isAlert: false
             });
        } else if (v.method === CookingMethod.BOIL) {
             steps.push({
                minutesBeforeServing: 15,
                action: `Start boiling ${v.name}`,
                description: `Put ${v.name} in boiling salted water.`,
                isAlert: true
             });
        } else if (v.method === CookingMethod.MASH) {
             steps.push({
                minutesBeforeServing: 30,
                action: `Boil potatoes for Mash`,
                description: `Boil peeled potatoes until soft.`,
                isAlert: true
             });
             steps.push({
                minutesBeforeServing: 5,
                action: `Mash Potatoes`,
                description: `Drain and mash with butter/milk.`,
                isAlert: false
             });
        }
    });

    // Gravy & Stuffing
    if (config.stuffing !== 'None') {
         steps.push({
            minutesBeforeServing: 30,
            action: 'Put Stuffing in oven',
            description: 'Place stuffing balls/tray in oven.',
            isAlert: true
         });
    }

    // Yorkshire Puddings
    if (config.yorkshires === 'Homemade') {
        steps.push({
            minutesBeforeServing: 35,
            action: 'Heat Yorkshire Oil',
            description: 'Put tray with oil/fat in oven to get smoking hot.',
            isAlert: true
        });
        steps.push({
            minutesBeforeServing: 25,
            action: 'Yorkshires In',
            description: 'Pour batter into hot oil and return to oven immediately. Do not open door!',
            isAlert: true
        });
    } else if (config.yorkshires === 'Packet') {
        steps.push({
            minutesBeforeServing: 5,
            action: 'Warm Yorkshires',
            description: 'Put packet Yorkshire puddings in oven to warm through.',
            isAlert: true
        });
    }

    if (config.gravy !== 'None') {
        steps.push({
            minutesBeforeServing: 15,
            action: 'Make Gravy',
            description: 'Prepare gravy using meat juices if available.',
            isAlert: true
        });
    }
    
    // Serve
    steps.push({
        minutesBeforeServing: 0,
        action: 'Serve Dinner',
        description: 'Carve meat and serve everything immediately.',
        isAlert: true
    });

    // Sort steps
    steps.sort((a, b) => b.minutesBeforeServing - a.minutesBeforeServing);

    const totalDuration = steps.length > 0 ? steps[0].minutesBeforeServing + 15 : 0;

    return {
        totalDurationMinutes: totalDuration,
        steps: steps,
        advice: "Remember to preheat your oven to 180°C/160°C Fan before you start! Times are estimates."
    };
};
