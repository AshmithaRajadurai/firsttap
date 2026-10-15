# WhatsApp Business Training & Catalogue Simulator

A standalone, interactive smartphone simulation designed to teach small shopkeepers and local merchants how to set up a WhatsApp Business account, verify with simulated OTP, and add products to their digital catalogue.

## Included Files

- **`WhatsAppBusinessSimulatorScreen.tsx`**: Complete interactive mobile smartphone simulation screen featuring:
  - **Part 1: Create Account**: Phone home screen, app launch, language selection, business phone number verification, simulated 6-digit OTP, business profile creation (name, category, photo, address, description), and verified merchant badge.
  - **Part 2: Add Catalogue**: Top tools tab, catalogue manager, product listing form with presets (Rice, Fresh Veggies, Banana Chips, Handloom Saree, Terracotta Clay Pot), price in ₹, description, item code, approval badge, multi-item catalogue showcase, link sharing, and customer view.
  - **Part 3: Practice Sandbox**: DIY challenge where shopkeepers build their store profile and add items with instant validation, feedback alerts, retry, and printable completion certificate.
- **`sampleData.ts`**: Preset shop profiles, sample Indian grocery/apparel products, and comprehensive step instructions in Tamil (தமிழ்), Hindi (हिंदी), and English.
- **`voice.ts`**: Web Speech API audio narration engine and sound synthesizer with language detection and tone chimes.
- **`types.ts`**: TypeScript definitions for products, store profiles, steps, and practice evaluations.
- **`index.ts`**: Barrel export file.

## Quick Start / Usage

```tsx
import React from 'react';
import { WhatsAppBusinessSimulatorScreen } from './whatsapp-business';

export default function App() {
  return (
    <WhatsAppBusinessSimulatorScreen
      onBackToMainMenu={() => console.log('Back to main menu')}
      onSwitchToMaps={() => console.log('Switch to Maps')}
      onSwitchToSpamCall={() => console.log('Switch to Spam Call')}
    />
  );
}
```

## Highlights

- **100% In-Browser Simulation**: Zero real phone calls or real SMS required.
- **Trilingual Voice & Subtitles**: English, தமிழ் (Tamil), and हिंदी (Hindi).
- **Zero Configuration**: Drop into any React project with standard Lucide icons.
