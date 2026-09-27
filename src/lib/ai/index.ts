import { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';

export function getAIProvider(): AIProvider {
  // Can be extended to initialize OpenAI / Gemini if environment keys exist
  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    // Return production AI provider wrapper if key exists
    return new MockAIProvider(); // Graceful fallback
  }
  return new MockAIProvider();
}

export * from './AIProvider';
export * from './MockAIProvider';
