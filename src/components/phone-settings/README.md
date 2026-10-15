# Basic Phone Settings Simulator Module

An interactive, voice-guided smartphone simulation designed for senior citizens and beginners to learn core Android settings without changing their real phone configuration.

## Included Lessons

1. **Mobile Internet (Data) ON/OFF**:
   - Swipe down from top status bar to reveal Quick Settings.
   - Tap Mobile Data to turn internet ON and OFF.
   - Visual 4G/LTE status bar indication and active tile state.
2. **Torch / Flashlight ON/OFF**:
   - Tap Flashlight tile to cast light in the dark.
   - Realistic beam of light glow animation and toggle feedback.
3. **Wi-Fi ON/OFF & Connection**:
   - Toggle Wi-Fi and browse nearby fictional networks (`Home_Fiber_5G`, `Sharma_Stores_Free`).
   - One-tap connection showing "Connected, Secured" and status bar Wi-Fi arc.
4. **Personal Hotspot ON/OFF**:
   - Share mobile internet with children/family devices.
   - Shows simulated hotspot name (`MyPhone_Hotspot`), password, and connected device (`Priya's Tablet`).
5. **Sound, Vibrate & Silent Modes**:
   - Cycle between Sound (plays marimba ringtone), Vibrate (haptic buzzer), and Silent (muted speaker).
6. **Practice Quiz & Certificate**:
   - 5 interactive questions with instant scoring, feedback, retry, and printable completion certificate.

## Usage in React

```tsx
import React from 'react';
import { PhoneSettingsSimulatorScreen } from './phone-settings-simulator';

export default function App() {
  return (
    <PhoneSettingsSimulatorScreen
      onBackToMainMenu={() => console.log('Back to main menu')}
      onSwitchToWhatsApp={() => console.log('Switch to WhatsApp')}
      onSwitchToMaps={() => console.log('Switch to Maps')}
    />
  );
}
```
