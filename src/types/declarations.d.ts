declare module 'lucide-react' {
  import * as React from 'react';
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }
  export type Icon = React.FC<IconProps>;

  export const Mic: Icon;
  export const MicOff: Icon;
  export const Volume2: Icon;
  export const VolumeX: Icon;
  export const RotateCcw: Icon;
  export const HelpCircle: Icon;
  export const Sparkles: Icon;
  export const Globe: Icon;
  export const ShieldCheck: Icon;
  export const ShieldAlert: Icon;
  export const QrCode: Icon;
  export const Smartphone: Icon;
  export const CheckCircle: Icon;
  export const ArrowRight: Icon;
  export const AlertTriangle: Icon;
  export const Trophy: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
}

declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }
  function confetti(options?: ConfettiOptions): Promise<null> | null;
  export default confetti;
}
