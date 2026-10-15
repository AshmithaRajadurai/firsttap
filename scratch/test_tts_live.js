const http = require('http');

async function testTTS(text, language_code, speaker) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ text, language_code, speaker });
    const req = http.request(
      'http://localhost:3000/api/tts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({
              statusCode: res.statusCode,
              provider: parsed.provider,
              model: parsed.model,
              speaker: parsed.speaker,
              mimeType: parsed.mimeType,
              audioBytes: parsed.audioBase64 ? parsed.audioBase64.length : 0,
              isMock: parsed.isMock,
              notice: parsed.notice,
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- Testing Live TTS Endpoint for Sarvam Bulbul v3 ---');

  // 1. Tamil default speaker (ishita)
  const tamilDefault = await testTTS(
    'சரி! நாம் தமிழில் தொடர்ந்து கற்கலாம். மிக்க மகிழ்ச்சி! உங்கள் பெயர் என்ன?',
    'ta-IN'
  );
  console.log('1. Tamil (Default Speaker):', JSON.stringify(tamilDefault, null, 2));

  // 2. Tamil testing speaker (ritu)
  const tamilRitu = await testTTS(
    'வணக்கம்! நான் உங்கள் FirstTap வழிகாட்டி.',
    'ta-IN',
    'ritu'
  );
  console.log('2. Tamil (Testing Speaker ritu):', JSON.stringify(tamilRitu, null, 2));

  // 3. English
  const english = await testTTS(
    'Great! We will continue learning in English. What is your name?',
    'en-IN'
  );
  console.log('3. English (en-IN):', JSON.stringify(english, null, 2));

  // 4. Hindi
  const hindi = await testTTS(
    'बहुत अच्छा! अब हम हिंदी में सीखेंगे। बहुत बढ़िया! आपका नाम क्या है?',
    'hi-IN'
  );
  console.log('4. Hindi (hi-IN):', JSON.stringify(hindi, null, 2));
}

run().catch(console.error);
