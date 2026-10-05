// Minimal client for TypeSafe's Jev (System One) API: POST /v1/systemone.
// Docs: https://docs.typesafe.ai/api.md

const JEV_URL = 'https://api.typesafe.ai/v1/systemone';

export type JevQuestion =
  | { type: 'choice'; instructions: string; criteria: Record<string, string> }
  | { type: 'score'; instructions: string; criteria: string[] }
  | { type: 'noul'; instructions: string };

export interface JevAnswer {
  type: 'choice' | 'score' | 'noul';
  choice?: string;
  score?: number;
  noul?: number;
  confidence?: number;
  probabilities?: Record<string, number>;
}

export async function askJev(
  apiKey: string,
  state: unknown,
  questions: Record<string, JevQuestion>,
  timeoutMs = 20000
): Promise<Record<string, JevAnswer>> {
  const res = await fetch(JEV_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state,
      model: process.env.JEV_MODEL || 'jev-latest',
      questions,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!res.ok) {
    throw new Error(`Jev API error ${res.status}`);
  }

  const data = (await res.json()) as { answers?: Record<string, JevAnswer> };
  return data.answers ?? {};
}
