import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { text, language_code, speaker } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    const targetLanguage = language_code || 'ta-IN';
    const apiKey = process.env.SARVAM_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      // Real Sarvam AI Bulbul Text-to-Speech API
      // Supported speakers include 'meera', 'pavithra', 'maitreyi', 'arvind', 'amol'
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: targetLanguage,
          speaker: speaker || 'meera',
          pitch: 0,
          pace: 0.95,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: 'bulbul:v1',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Sarvam TTS error:', response.status, errorText);
        return NextResponse.json({
          isMock: true,
          text,
          language_code: targetLanguage,
          error: `Sarvam API error: ${response.status}`,
          provider: 'browser-fallback',
        });
      }

      const data = await response.json();
      const base64Audio = data.audios && data.audios[0] ? data.audios[0] : null;

      if (base64Audio) {
        return NextResponse.json({
          audioBase64: base64Audio,
          isMock: false,
          provider: 'sarvam-bulbul',
        });
      }
    }

    // MOCK / BROWSER FALLBACK MODE
    return NextResponse.json({
      isMock: true,
      text,
      language_code: targetLanguage,
      provider: 'browser-speech-synthesis',
      message: 'Demo Mode: SARVAM_API_KEY not configured. Browser Web Speech Synthesis will play spoken audio.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('TTS API route error:', message);
    return NextResponse.json(
      { error: 'Failed to generate speech', details: message },
      { status: 500 }
    );
  }
}
