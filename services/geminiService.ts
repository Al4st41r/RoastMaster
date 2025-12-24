import { GoogleGenAI, Type } from "@google/genai";
import { RoastConfig, RoastSchedule } from '../types';

export const generateRoastSchedule = async (config: RoastConfig): Promise<RoastSchedule> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const selectedVeggies = config.veggies
    .filter(v => v.selected)
    .map(v => `${v.name} (${v.method})`)
    .join(', ');

  const prompt = `
    Create a precise, master-chef level cooking schedule for a British Roast Dinner.
    
    Parameters:
    - Meat: ${config.meat}
    - Weight: ${config.weightKg} kg
    - Oven Setup: ${config.ovenType}
    - Vegetables: ${selectedVeggies}
    - Gravy: ${config.gravy}
    - Stuffing: ${config.stuffing}

    Requirements:
    1. Calculate exact cooking times for the meat based on weight. Standard British preferences (e.g., medium for beef unless specified).
    2. Include resting time for the meat (CRITICAL).
    3. Coordinate all vegetable cooking so everything finishes exactly at "Serving Time" (T=0).
    4. Account for oven temperature management. If "Single Oven", prioritize the meat's required temp and adjust vegetable timings or suggest when to change temp.
    5. Return a schedule relative to serving time (minutesBeforeServing).
    6. Include prep steps (peeling, boiling water) inserted at reasonable times.
    7. Include a step for making the gravy and stuffing.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalDurationMinutes: { type: Type.NUMBER, description: "Total time from first prep step to serving" },
          advice: { type: Type.STRING, description: "General advice for this specific combination" },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                minutesBeforeServing: { type: Type.NUMBER, description: "Minutes remaining until serving time (e.g. 120). Must be positive." },
                action: { type: Type.STRING, description: "Short action title (e.g. 'Put Beef in Oven')" },
                description: { type: Type.STRING, description: "Detailed instruction including temps" },
                isAlert: { type: Type.BOOLEAN, description: "True if this step needs an audible alarm" }
              },
              required: ["minutesBeforeServing", "action", "description", "isAlert"]
            }
          }
        },
        required: ["totalDurationMinutes", "steps", "advice"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate schedule");
  }

  return JSON.parse(response.text) as RoastSchedule;
};
