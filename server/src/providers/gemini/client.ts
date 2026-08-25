import { GoogleGenAI } from '@google/genai';
import { geminiConfig } from './config';

let geminiClientInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!geminiConfig.apiKey) {
    return null;
  }
  if (!geminiClientInstance) {
    geminiClientInstance = new GoogleGenAI({ apiKey: geminiConfig.apiKey });
  }
  return geminiClientInstance;
}
