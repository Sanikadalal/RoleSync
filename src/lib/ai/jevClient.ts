// Minimal client for Jev (TypeSafe System One). Two ways to reach it, same request shape:
//  - TypeSafe direct:  POST https://api.typesafe.ai/v1/systemone      (docs.typesafe.ai)
//  - OpenRouter:       POST https://openrouter.ai/api/alpha/decisions (keys start with "sk-or-")

function endpointFor(apiKey: string): { url: string; model: string } {
  if (apiKey.startsWith('sk-or-')) {
    return {
      url: 'https://openrouter.ai/api/alpha/decisions',
      model: process.env.JEV_MODEL || 'typesafe/jev-1.13',
    };
  }
  return {
    url: 'https://api.typesafe.ai/v1/systemone',
    model: process.env.JEV_MODEL || 'jev-latest',
  };
}

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
  const { url, model } = endpointFor(apiKey);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state,
      model,
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
