import { FunctionTool, LlmAgent } from '@google/adk';
import { z } from 'zod';

const getCurrentTime = new FunctionTool({
  name: 'get_current_time',
  description: 'Returns the current time in a specified city.',
  parameters: z.object({
    city: z.string().describe('The name of the city for which to retrieve the current time.'),
  }) as any,
  // 建議用 async，符合官方 TS 範例型態（回傳 Promise<obj>）
  execute: async ({ city }: { city: string }) => {
    return { status: 'success', report: `The current time in ${city} is 10:30 AM` };
  },
});

const googleSearch = new FunctionTool({
    name: 'google_search',
    description: 'Searches the web for information.',
    parameters: z.object({
        query: z.string().describe('The query to search for.'),
    }) as any,
    execute: async ({ query }: { query: string }) => {
        // Mock implementation since we can't import the built-in tool freely
        return { 
            status: 'success', 
            report: `[Mock Search Result] Results for "${query}":\n1. Example Result Title - This is a summary of the result.\n2. Another Result - More info here.` 
        };
    }
});

export const rootAgent = new LlmAgent({
  name: 'hello_time_agent',
  model: 'gemini-2.5-flash',
  description: 'A helpful assistant that can tell time and search the web.',
  instruction: `You are a helpful assistant that can answer questions using Google Search or tell the current time in a city.
Use the \`get_current_time\` tool for time queries.
Use the \`google_search\` tool for other queries or recent events.`,
  tools: [getCurrentTime, googleSearch],
});
