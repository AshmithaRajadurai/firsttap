import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates that text contains expected language script
 */
function validateLanguageText(text: string, languageCode: string): { valid: boolean; warning?: string } {
  const langPrefix = languageCode.split('-')[0].toLowerCase();
  if (langPrefix === 'ta') {
    // Tamil Unicode block: U+0B80 - U+0BFF
    const hasTamil = /[\u0B80-\u0BFF]/.test(text);
    if (!hasTamil && !/FirstTap/i.test(text)) {
      return { valid: false, warning: 'Expected Tamil Unicode characters, but found none.' };
    }
  } else if (langPrefix === 'hi') {
    // Devanagari Unicode block: U+0900 - U+097F
    const hasHindi = /[\u0900-\u097F]/.test(text);
    if (!hasHindi && !/FirstTap/i.test(text)) {
      return { valid: false, warning: 'Expected Hindi Devanagari characters, but found none.' };
    }
  }
  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;
    const rawLang = body.language_code || body.language || 'ta-IN';

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    // Standardize to BCP-47 tag
    let targetLanguage = rawLang;
    const langPrefix = rawLang.split('-')[0].toLowerCase();
    if (langPrefix === 'ta') targetLanguage = 'ta-IN';
    else if (langPrefix === 'hi') targetLanguage = 'hi-IN';
    else if (langPrefix === 'en') targetLanguage = 'en-IN';

    // Verification check for language alignment
    const validation = validateLanguageText(text, targetLanguage);
    if (!validation.valid) {
      console.warn(`[TTS API] Language mismatch warning for ${targetLanguage}: ${validation.warning}`);
    }

    // Enforce consistent female speaker:
    // Sarvam Bulbul canonical female speaker: 'ishita' (articulate, warm female Indian voice)
    // Alternate supported female speaker: 'ritu'
    let targetSpeaker = 'ishita';
    if (body.speaker && typeof body.speaker === 'string') {
      const spk = body.speaker.toLowerCase().trim();
      if (['ishita', 'ritu', 'shreya', 'kavya', 'priya', 'neha', 'pooja'].includes(spk)) {
        targetSpeaker = spk;
      }
    }

    const apiKey = process.env.SARVAM_API_KEY;
    const hasValidApiKey = apiKey && apiKey.trim() !== '' && apiKey.trim() !== 'your_sarvam_api_key_here';

    // 1. Primary: Sarvam AI Bulbul Text-to-Speech API
    const cleanText = text.trim();
    if (hasValidApiKey && cleanText) {
      try {
        console.log(`[TTS API] Calling Sarvam Bulbul: lang=[${targetLanguage}], speaker=[${targetSpeaker}] (female), text="${cleanText.slice(0, 50)}..."`);
        
        // Truncate to Sarvam safe length (max 500 chars)
        const sarvamText = cleanText.length > 500 ? cleanText.slice(0, 495) + '...' : cleanText;
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey.trim(),
          },
          body: JSON.stringify({
            text: sarvamText,
            language_code: targetLanguage,
            target_language_code: targetLanguage,
            model: 'bulbul:v3',
            speaker: targetSpeaker,
            pace: 1.0,
            speech_sample_rate: 22050,
            output_audio_codec: 'wav',
            temperature: 0.6,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const base64Audio = data.audios && data.audios[0] ? data.audios[0] : null;

          if (base64Audio) {
            console.log(`[TTS API] Sarvam Bulbul success: requestId=${data.request_id}, bytes=${base64Audio.length}`);
            const mimeType = 'audio/wav';
            return NextResponse.json({
              audioBase64: base64Audio,
              audioDataUrl: `data:${mimeType};base64,${base64Audio}`,
              mimeType,
              format: mimeType,
              isMock: false,
              provider: 'sarvam-bulbul-v3',
              model: 'bulbul:v3',
              speaker: targetSpeaker,
              gender: 'female',
              language_code: targetLanguage,
              request_id: data.request_id,
            });
          }
        } else {
          const errorText = await response.text();
          console.warn(`[TTS API] Sarvam Bulbul returned HTTP ${response.status}: ${errorText}`);
        }
      } catch (sarvamErr) {
        console.warn('[TTS API] Sarvam API network error, proceeding to secondary fallback:', sarvamErr);
      }
    } else if (!hasValidApiKey) {
      console.log('[TTS API] No active SARVAM_API_KEY detected. Using high-quality female secondary fallback.');
    }

    // 2. High-Quality Secondary Fallback: Multi-lingual TTS audio service
    // Generates genuine native Tamil, Hindi, and English spoken female audio without requiring local Windows packs
    try {
      const encodedText = encodeURIComponent(cleanText.slice(0, 300));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${langPrefix}&client=tw-ob`;
      
      const ttsRes = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (ttsRes.ok) {
        const arrayBuffer = await ttsRes.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = 'audio/mpeg';
        return NextResponse.json({
          audioBase64: base64Audio,
          audioDataUrl: `data:${mimeType};base64,${base64Audio}`,
          mimeType,
          format: mimeType,
          isMock: false,
          provider: 'native-multilingual-tts-fallback',
          language_code: targetLanguage,
          model: 'fallback',
          speaker: targetSpeaker,
          gender: 'female',
          notice: !hasValidApiKey ? 'Using secondary high-quality female voice (Sarvam key not set in .env.local).' : 'Sarvam API call failed; used secondary native TTS.',
        });
      }
    } catch (fallbackErr) {
      console.warn('[TTS API] Secondary TTS fallback error, proceeding to tertiary fallback:', fallbackErr);
    }

    // 3. Tertiary: Browser Speech Synthesis Fallback
    return NextResponse.json({
      isMock: true,
      text: cleanText,
      language_code: targetLanguage,
      provider: 'browser-speech-synthesis',
      gender: 'female',
      preferredSpeaker: 'ishita',
      message: 'Browser Web Speech Synthesis fallback active.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('TTS API route error:', message);
    return NextResponse.json({
      isMock: true,
      provider: 'browser-speech-synthesis',
      gender: 'female',
      error: 'Failed to generate remote speech',
      details: message,
    });
  }
}
