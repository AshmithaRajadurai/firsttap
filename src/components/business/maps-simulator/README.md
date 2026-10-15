# Standalone Google Maps Simulator Module

An interactive, voice-guided Google Maps simulation designed for elderly and first-time smartphone users to master searching places, getting turn-by-turn navigation, adding a home/shop location, and sharing live locations.

## Included Files

- **`GoogleMapsSimulatorScreen.tsx`**: Main interactive mobile simulator screen with realistic Google Maps UI, search bar, map canvas, route preview, navigation turn-by-turn guidance, location pin dropper, and practice sandboxes.
- **`mapsSimulatorLessons.ts`**: Comprehensive lessons track:
  - **Lesson 1**: Find a Nearby Place (Hospital / Pharmacy / Grocery)
  - **Lesson 2**: Start Turn-by-Turn Voice Navigation
  - **Lesson 3**: Save & Add Home or Shop Location Pin
  - **Lesson 4**: Share Live Location with Family
- **`voice.ts`**: Web Speech API audio guidance and navigation voice prompts in Tamil, Hindi, and English with tone chime fallbacks.
- **`types.ts`**: TypeScript type definitions for map points, coordinates, steps, and simulation states.
- **`index.ts`**: Central module export file.

## Quick Start / Usage

```tsx
import React from 'react';
import { GoogleMapsSimulatorScreen } from './maps-simulator';

export default function App() {
  return (
    <GoogleMapsSimulatorScreen
      onBackToMainMenu={() => console.log('Back to main menu')}
      onSwitchToWhatsApp={() => console.log('Switch to WhatsApp')}
      onSwitchToSpamCall={() => console.log('Switch to Spam Call')}
    />
  );
}
```

## Features

- **No API Key Required**: 100% self-contained simulated canvas and map tiles.
- **Trilingual Voice & Subtitles**: English, Tamil (தமிழ்), and Hindi (हिंदी).
- **Interactive Spotlights**: Highlights next tap with pulsing guide ring so learners never get confused.
- **Turn-by-turn GPS Navigation**: Voice prompts ("In 200 meters, turn right on Main Bazaar Road").
- **Drop Pin & Save Location**: Add shop or home with custom name and phone number.
