import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('file') as Blob | null;
    const rawLanguageCode = (formData.get('language_code') as string) || 'ta-IN';
    const languageCode = rawLanguageCode === 'multilingual' ? 'en-IN' : rawLanguageCode;
    const clientFallbackText = (formData.get('fallback_text') as string) || '';

    console.log(`[API:STT] Received audio file: ${audioFile?.size ?? 0} bytes, languageCode: ${languageCode}, fallbackText: "${clientFallbackText}"`);

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided', transcript: clientFallbackText },
        { status: 400 }
      );
    }

    // Safety checks: File size limit (10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file exceeds 10MB limit' },
        { status: 413 }
      );
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      // Real Sarvam AI Speech-to-Text API Call
      const sarvamFormData = new FormData();
      sarvamFormData.append('file', audioFile, 'recording.wav');
      sarvamFormData.append('model', 'saaras:v1');
      sarvamFormData.append('language_code', languageCode);

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey,
        },
        body: sarvamFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sarvam STT error:', response.status, errorText);
        // Fallback to client transcribed text if API errors
        return NextResponse.json({
          transcript: clientFallbackText || '',
          isMock: true,
          error: `Sarvam API error: ${response.status}`,
          provider: 'fallback',
        });
      }

      const data = await response.json();
      const transcript = data.transcript || '';

      return NextResponse.json({
        transcript,
        isMock: false,
        provider: 'sarvam-saaras',
      });
    }

    // MOCK / FALLBACK MODE when SARVAM_API_KEY is not configured
    // If browser WebSpeech provided transcription, use it; otherwise provide a context-friendly demo response
    const transcript = clientFallbackText || '';

    return NextResponse.json({
      transcript,
      isMock: true,
      provider: 'browser-web-speech-fallback',
      message: 'Demo Mode: SARVAM_API_KEY not configured. Using Web Speech recognition.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('STT API route error:', message);
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: message },
      { status: 500 }
    );
  }
}
