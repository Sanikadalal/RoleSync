import mammoth from 'mammoth';

export interface ExtractedTextResult {
  text: string;
  wordCount: number;
  format: 'pdf' | 'docx' | 'txt';
  error?: string;
}

export async function parseResumeFile(
  fileBuffer: Buffer,
  fileName: string
): Promise<ExtractedTextResult> {
  const ext = fileName.split('.').pop()?.toLowerCase();

  try {
    if (ext === 'pdf') {
      // Dynamic import or require for pdf-parse server-side compatibility
      const pdfParse = require('pdf-parse');
      const parsed = await pdfParse(fileBuffer);
      const text = parsed.text ? parsed.text.trim() : '';
      if (!text || text.length < 20) {
        return {
          text: '',
          wordCount: 0,
          format: 'pdf',
          error:
            "We couldn't extract readable text from this PDF. Try uploading a text-based PDF or DOCX file.",
        };
      }
      return {
        text,
        wordCount: text.split(/\s+/).length,
        format: 'pdf',
      };
    } else if (ext === 'docx' || ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      const text = result.value ? result.value.trim() : '';
      if (!text || text.length < 20) {
        return {
          text: '',
          wordCount: 0,
          format: 'docx',
          error:
            "We couldn't extract readable text from this Word document. Ensure it contains standard text content.",
        };
      }
      return {
        text,
        wordCount: text.split(/\s+/).length,
        format: 'docx',
      };
    } else if (ext === 'txt') {
      const text = fileBuffer.toString('utf-8').trim();
      return {
        text,
        wordCount: text.split(/\s+/).length,
        format: 'txt',
      };
    } else {
      return {
        text: '',
        wordCount: 0,
        format: 'txt',
        error: `Unsupported file type: .${ext}. Please upload a PDF, DOCX, or TXT file.`,
      };
    }
  } catch (err: any) {
    return {
      text: '',
      wordCount: 0,
      format: (ext as any) || 'txt',
      error: `Failed to extract text from file: ${err.message || 'Corrupted or unreadable format.'}`,
    };
  }
}
