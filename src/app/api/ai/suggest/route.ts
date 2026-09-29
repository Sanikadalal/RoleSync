import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bulletText, contextRole, jobKeywords } = body;

    if (!bulletText) {
      return NextResponse.json(
        { error: 'Bullet text is required for AI suggestions.' },
        { status: 400 }
      );
    }

    const aiProvider = getAIProvider();
    const suggestions = await aiProvider.suggestResumeChanges(
      bulletText,
      contextRole || 'Software Engineer',
      jobKeywords || []
    );

    return NextResponse.json({ success: true, suggestions });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to generate AI suggestions.' },
      { status: 500 }
    );
  }
}
