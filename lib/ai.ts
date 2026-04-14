import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type PlanningInput = {
  ageGroup: string;
  duration: string;
  location: string;
  energyLevel: string;
  materials: string;
  jewishThemeType: string;
  topic: string;
  activityType: string;
};

type InsightInput = {
  childName: string;
  age: string;
  observations: string;
  developmentFocus: string;
  concernLevel: string;
  tone: string;
  jewishFraming: boolean;
};

export async function generatePlanning(input: PlanningInput) {
  if (!client) {
    return `Title: ${input.topic} ${input.activityType}\nSummary: A ${input.duration} ${input.location} activity for ${input.ageGroup}.\nMaterials: ${input.materials}\nSteps: 1) Introduce theme 2) Guided activity 3) Reflection circle\nJewish message: Connect ${input.jewishThemeType} through ${input.topic}.\nExtensions: Add movement and Hebrew vocabulary cards.\nCleanup: Children sort materials into labeled bins.`;
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `You are a Jewish early years planner. Generate a practical activity with title, summary, materials, setup, steps, Jewish message, extensions, cleanup. Input: ${JSON.stringify(input)}`
  });

  return response.output_text;
}

export async function generateInsight(input: InsightInput) {
  if (!client) {
    return `Parent Summary: ${input.childName} engaged positively today.\nWhat child is showing: Emerging ${input.developmentFocus} through play and communication.\nWhat it may mean: Consistent opportunities are supporting confidence.\nHome support suggestions: Continue short, playful routines at home.\nJewish framing: ${input.jewishFraming ? "Connect progress to a middah such as kindness." : "Not requested."}\nInternal note: Concern level marked as ${input.concernLevel}; monitor over time.`;
  }

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `You are creating parent insight updates for nursery staff. Never diagnose or provide medical advice. Return sections: parent summary, what child is showing, what it may mean, home support suggestions, optional Jewish framing, internal note. Input: ${JSON.stringify(input)}`
  });

  return response.output_text;
}
