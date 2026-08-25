import { env } from '../../config/env';

export const geminiConfig = {
  apiKey: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  defaultModel: 'gemini-2.5-flash',
  temperature: 0.7,
  maxOutputTokens: 2048,
};
