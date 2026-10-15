# 📱 Standalone WhatsApp Learning Engine (FirstTap Message)

A completely self-contained, drop-in React module for teaching and simulating WhatsApp. It includes **the animated Demo runner (hands-free guided video/pointer)**, **the Test / Practice mode with mistake tracking and spotlight pointer**, **the full on-screen Simulated Keyboard**, **Celebration cards**, and **trilingual Web Speech narration** (English, Tamil, and Hindi).

---

## 📁 What is in this Folder (`src/standalone-whatsapp/`)?

| File | Purpose |
|------|---------|
| **`FirstTapWhatsApp.tsx`** | The complete FirstTap Message WhatsApp simulator (screens: Chat List, Add Contact, Chat Room with bubbles, Attachment Picker, Location Sharing, Voice Notes, Voice/Video Calls, and Fake Lottery Scam Call Safety Drill). |
| **`DemoRunnerOverlay.tsx`** | **Demo Video / Runner**: Interactive autoplay guide with a smoothly gliding finger pointer (`MousePointerClick`), ripple tap effects, speed switch (Slow/Normal), Pause/Resume, and "Stop - let me try" button. |
| **`PracticeSpotlightOverlay.tsx`** | **Test / Practice Mode**: Real-time bounding-box spotlight ring on target elements. Detects wrong taps, shakes on error, speaks audio correction, increments mistake counter, and automatically replays demo after 3 mistakes. |
| **`SimulatedKeyboard.tsx`** | Custom mobile on-screen keyboard (QWERTY letters + numbers) with individual key spotlighting (`key-a`, `key-space`, etc.) for guided typing. |
| **`SegmentDoneCard.tsx`** | Post-test celebration card with "Next Lesson", "Do it again", and "Menu" actions. |
| **`chatLessonTracks.ts`** | Complete curriculum definition for all 8 tracks (**W0** to **W7**): Home Tour, Save Contact, Send Message, Send Voice Note, Send Photo, Share Location, Make/Mute Calls, and Scam Call Safety. Includes full say lines in English, Tamil, and Hindi. |
| **`WhatsAppTutorialScreen.tsx`** | Alternative 5-lesson WhatsApp tutorial screen with step-by-step guidance. |
| **`whatsappLessons.ts`** | Lesson curriculum definitions for `WhatsAppTutorialScreen`. |
| **`voice.ts`** | Zero-dependency Web Speech API voice synthesis engine. Supports Tamil (`ta-IN`), Hindi (`hi-IN`), and English (`en-IN`/`en-US`), with digit-by-digit reading and speech completion timeouts. |
| **`types.ts`** | Self-contained TypeScript definitions (`LanguageCode`, `StepAttempt`, `Step`, `Lesson`, etc.). |
| **`StandaloneWhatsAppApp.tsx`** | Ready-to-mount demonstration container with mobile bezel mockup and language switcher. |
| **`index.ts`** | Clean barrel exports for easy importing. |

---

## 🚀 How to Drop This Into Any Other Web App

### Step 1: Copy the Folder
Copy the `src/standalone-whatsapp/` folder into your destination project (e.g. `src/components/whatsapp/`).

### Step 2: Install Dependencies
This module requires only standard React and `lucide-react`:
```bash
npm install lucide-react
```
*(Tailwind CSS is used for utility styling).*

### Step 3: Render It
In any page or component in your app:

```tsx
import React from 'react';
import { FirstTapWhatsApp } from './standalone-whatsapp';

export default function MyPage() {
  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Mobile container viewport */}
      <div className="w-full max-w-md h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
        <FirstTapWhatsApp
          language="en" // 'en' | 'ta' | 'hi'
          onLogAttempt={(attempt) => {
            console.log('User attempt logged:', attempt);
          }}
          onFinishModule={() => {
            console.log('User completed all WhatsApp lessons!');
          }}
          onExit={() => {
            console.log('User clicked Back/Exit');
          }}
        />
      </div>
    </div>
  );
}
```

Or run the full demo container with phone frame & language switcher:
```tsx
import { StandaloneWhatsAppApp } from './standalone-whatsapp/StandaloneWhatsAppApp';

export default function App() {
  return <StandaloneWhatsAppApp />;
}
```

---

## 🎬 Features Breakdown

### 1. 🎥 Demo Runner (`DemoRunnerOverlay`)
- Runs hands-free autoplay through each step of the lesson.
- Smooth floating finger pointer glides across the screen to the target element.
- Shows ripple animations on tap.
- Automatically synchronizes with audio speech (Selvi's voice).
- Includes **Pause / Resume**, **Speed toggle** (Slow / Normal), and **"Stop - let me try"** to jump straight into test mode.

### 2. 🎯 Test / Practice Mode (`PracticeSpotlightOverlay`)
- User performs the actions themselves on the interactive simulator.
- Bounding-box highlighter illuminates the exact target button or keyboard key.
- **Wrong-tap capture**: If the user taps anywhere other than the correct target, it shakes with a red ring and gives a gentle voice correction.
- **Mistake Counter**: Tracks mistakes; after 3 failed attempts, automatically offers to replay the demo.

### 3. ⌨️ Simulated On-Screen Keyboard (`SimulatedKeyboard`)
- Features numbers row + QWERTY letters.
- Dynamically highlights the next required key during typing steps (`spotlightKey="key-l"`, `key-space`, etc.).

### 4. 🌐 Native Speech Engine (`voice.ts`)
- Zero external APIs or cloud tokens needed; uses browser-native `window.speechSynthesis`.
- Automatically selects the best available Tamil, Hindi, or English voice on Android, iOS, Windows, and macOS.
