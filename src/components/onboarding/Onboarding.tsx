import React from 'react';
import { Onboarding as LegacyOnboarding } from '../onboarding';

export type OBPayload = {
  userName: string;
  cycleSize: number;
  counter: {
    name: string;
    color: string;
    icon: string;
    target: number;
    reminder?: { hour: number; minute: number } | null;
  };
};

type Props = { onComplete: (payload: OBPayload) => void; onSkip?: () => void };

export function Onboarding({ onComplete, onSkip }: Props) {
  return (
    <LegacyOnboarding
      onComplete={(data: any) => {
        const payload: OBPayload = {
          userName: data?.userName || 'Seeker',
          cycleSize: data?.counter?.cycleSize ?? data?.cycleSize ?? 108,
          counter: {
            name: data?.counter?.name || 'My Practice',
            color: data?.counter?.color || '#34C759',
            icon: 'lotus',
            target: data?.counter?.target ?? 1,
          },
        };
        onComplete(payload);
      }}
      onSkip={() => {
        if (onSkip) {
          onSkip();
          return;
        }
        const payload: OBPayload = {
          userName: 'Seeker',
          cycleSize: 108,
          counter: { name: 'My Practice', color: '#34C759', icon: 'lotus', target: 1 },
        };
        onComplete(payload);
      }}
    />
  );
}
