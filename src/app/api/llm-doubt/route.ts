import { NextRequest, NextResponse } from 'next/server';


const FALLBACK_DOUBT_ANSWERS: Record<
  string,
  Record<'ta-IN' | 'en-IN' | 'hi-IN', string>
> = {
  otp: {
    'ta-IN': 'OTP என்பது உங்கள் போனுக்கு வரும் ஒருமுறை பயன்படுத்தும் ரகசிய எண். இது உங்கள் பணத்தைப் பாதுகாக்கும் பூட்டு. இதை வங்கி அதிகாரிகள் கேட்டாலும் ஒருபோதும் சொல்லக்கூடாது.',
    'en-IN': 'An OTP is a one-time secret password sent to your phone. Think of it as a digital padlock for your money. Never share it with anyone, not even someone claiming to be a bank manager.',
    'hi-IN': 'ओटीपी एक बार इस्तेमाल होने वाला गुप्त नंबर है जो आपके मोबाइल पर आता है। यह आपके पैसों की सुरक्षा का ताला है। इसे किसी को भी, यहाँ तक कि बैंक अधिकारी को भी कभी न बताएं।',
  },
  pin: {
    'ta-IN': 'UPI PIN என்பது ஏடிஎம் பின் போன்ற உங்கள் சொந்த ரகசிய எண். நீங்கள் பிறருக்குப் பணம் அனுப்பும்போது மட்டுமே இதை அடிக்க வேண்டும். பணம் பெறவோ, பரிசு வாங்கவோ PIN தேவையில்லை.',
    'en-IN': 'Your UPI PIN is like your secret ATM PIN. You only type it when SENDING money. You never need to enter your PIN to receive money or lottery prizes.',
    'hi-IN': 'यूपीआई पिन आपके एटीएम पिन की तरह एक गुप्त नंबर है। यह सिर्फ पैसे भेजते समय डाला जाता है। पैसे प्राप्त करने या इनाम पाने के लिए पिन की कभी ज़रूरत नहीं होती।',
  },
  gpay_safety: {
    'ta-IN': 'கூகுள் பே மற்றும் போன்பே பாதுகாப்பானவை. ஆனால் நீங்கள் யாருக்குப் பணம் அனுப்புகிறீர்கள் என்பதைப் பெயரையும் தொகையையும் உறுதிசெய்து மட்டுமே அனுப்ப வேண்டும்.',
    'en-IN': 'Google Pay and PhonePe are very secure apps. Just always double-check the recipient name and amount before confirming the payment.',
    'hi-IN': 'गूगल पे और फोनपे सुरक्षित ऐप्स हैं। बस पैसे भेजने से पहले हमेशा प्राप्तकर्ता का नाम और राशि ज़रूर जांच लें।',
  },
  scam: {
    'ta-IN': 'லாட்டரி விழுந்தது அல்லது கணக்கு முடக்கப்படும் என்று போனில் மிரட்டினால் உடனே இணைப்பைத் துண்டித்து விடுங்கள். எந்த வங்கியும் போனில் OTP கேட்காது.',
    'en-IN': 'If someone calls claiming you won a lottery or threatens to block your bank account, hang up immediately. Real banks never ask for OTP or passwords on calls.',
    'hi-IN': 'अगर कोई फोन पर कहे कि आपकी लॉटरी लगी है या खाता बंद हो जाएगा, तो तुरंत फोन काट दें। कोई भी असली बैंक फोन पर पासवर्ड या ओटीपी नहीं माँगता।',
  },
  default: {
    'ta-IN': 'கைப்பேசியைப் பயன்படுத்துவது மிகவும் எளிதானது. பயப்படாமல் பொறுமையாக முயற்சி செய்யுங்கள், உங்களுக்கு உதவ நான் எப்போதும் இருக்கிறேன்.',
    'en-IN': 'Using a smartphone is easy once you practice. Take it step by step, and I am always here to guide you safely.',
    'hi-IN': 'स्मार्टफोन चलाना बहुत आसान है। धीरे-धीरे सीखें और बिना डरे अभ्यास करें, मैं हर कदम पर आपकी मदद के लिए यहाँ हूँ।',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question = (
      body.question ||
      body.doubtQuestion ||
      body.prompt ||
      body.text ||
      ''
    ).toString().trim();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const rawLang = (body.language_code || body.language || 'ta-IN').toString();
    const lang: 'ta-IN' | 'en-IN' | 'hi-IN' =
      rawLang.startsWith('ta') ? 'ta-IN' : rawLang.startsWith('hi') ? 'hi-IN' : 'en-IN';
    const name = body.userName || body.name || 'Learner';
    const context = body.context || 'Smartphone literacy & digital safety lesson';

    // Check Gemini API Key from multiple sources
    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      '';
    const geminiKey = rawKey.trim() !== 'your_gemini_api_key_here' ? rawKey.trim() : '';

    if (geminiKey) {
      const targetLangName =
        lang === 'ta-IN' ? 'Tamil' : lang === 'hi-IN' ? 'Hindi' : 'Indian English';

      const systemPrompt = `You are "Selvi", an empathetic, patient, and highly encouraging female AI teacher in FirstTap, helping first-time smartphone learners in India.
Current learner name: ${name}
Target spoken language: ${targetLangName}
Lesson context: ${context}

RULES:
1. Explain answers clearly and warmly so a beginner or elder can easily understand.
2. Keep the answer CONCISE: maximum 2 to 3 friendly sentences, conversational and natural for voice readout.
3. Respond ONLY in the requested language (${targetLangName}). Do NOT use markdown asterisks or bullet points.
4. Digital Safety: If asked about payments or banking, remind them to NEVER share their UPI PIN or OTP with anyone.`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.8-flash'];

      for (const model of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `${systemPrompt}\n\nLearner's Question: "${question}"\n\nSelvi's spoken response:`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  maxOutputTokens: 1024,
                  temperature: 0.3,
                  thinkingConfig: {
                    thinkingBudget: 0,
                  },
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const answerText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (answerText) {
              return NextResponse.json({
                answer: answerText,
                provider: 'gemini',
                model,
                isMock: false,
              });
            }
          } else {
            const errData = await geminiRes.text();
            console.warn(`Gemini (${model}) returned status ${geminiRes.status}:`, errData.slice(0, 150));
          }
        } catch (geminiErr) {
          console.warn(`Gemini (${model}) network error:`, geminiErr);
        }
      }
    }

    // Smart localized fallback matching for educational questions
    const qLower = question.toLowerCase();
    let category = 'default';

    if (qLower.includes('otp') || qLower.includes('ஓடிபி') || qLower.includes('ओटीपी')) {
      category = 'otp';
    } else if (qLower.includes('pin') || qLower.includes('பின்') || qLower.includes('பின்னம்பா்') || qLower.includes('पिन')) {
      category = 'pin';
    } else if (
      qLower.includes('gpay') ||
      qLower.includes('phonepe') ||
      qLower.includes('paytm') ||
      qLower.includes('upi') ||
      qLower.includes('பணம்') ||
      qLower.includes('पैसे')
    ) {
      category = 'gpay_safety';
    } else if (
      qLower.includes('scam') ||
      qLower.includes('fake') ||
      qLower.includes('lottery') ||
      qLower.includes('ஏமாற்று') ||
      qLower.includes('போலி') ||
      qLower.includes('धोखा') ||
      qLower.includes('फर्जी')
    ) {
      category = 'scam';
    }

    const fallbackAnswer = FALLBACK_DOUBT_ANSWERS[category][lang];

    return NextResponse.json({
      answer: fallbackAnswer,
      provider: 'built-in-safety-knowledge',
      isMock: true,
      message: 'Demo Mode: Using built-in verified digital safety knowledge base.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to resolve doubt', details: message },
      { status: 500 }
    );
  }
}
