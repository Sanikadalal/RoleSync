import { AIProvider } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { JevProvider } from './JevProvider';

export function getAIProvider(): AIProvider {
  // Jev (TypeSafe System One) handles matching, seniority and bullet-quality judgments.
  // Without a key the app runs in deterministic Mock / Demo mode.
  const jevKey = process.env.TYPESAFE_API_KEY;
  if (jevKey) {
    return new JevProvider(jevKey);
  }
  return new MockAIProvider();
}

export * from './AIProvider';
export * from './MockAIProvider';
