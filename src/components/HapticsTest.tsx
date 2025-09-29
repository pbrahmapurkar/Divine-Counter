import React from 'react';
import { HapticsService } from '../utils/haptics';

interface HapticsTestProps {
  hapticFeedback: boolean;
}

export function HapticsTest({ hapticFeedback }: HapticsTestProps) {
  const testTap = async () => {
    if (hapticFeedback) {
      await HapticsService.tap();
    }
  };

  const testCompletion = async () => {
    if (hapticFeedback) {
      await HapticsService.completion();
    }
  };

  const testAction = async () => {
    if (hapticFeedback) {
      await HapticsService.action();
    }
  };

  const testLight = async () => {
    if (hapticFeedback) {
      await HapticsService.light();
    }
  };

  const testMedium = async () => {
    if (hapticFeedback) {
      await HapticsService.medium();
    }
  };

  const testHeavy = async () => {
    if (hapticFeedback) {
      await HapticsService.heavy();
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">Haptics Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        Haptic Feedback: {hapticFeedback ? 'Enabled' : 'Disabled'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={testTap}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Test Tap
        </button>
        <button
          onClick={testCompletion}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm"
        >
          Test Completion
        </button>
        <button
          onClick={testAction}
          className="px-3 py-2 bg-orange-500 text-white rounded text-sm"
        >
          Test Action
        </button>
        <button
          onClick={testLight}
          className="px-3 py-2 bg-gray-500 text-white rounded text-sm"
        >
          Test Light
        </button>
        <button
          onClick={testMedium}
          className="px-3 py-2 bg-yellow-500 text-white rounded text-sm"
        >
          Test Medium
        </button>
        <button
          onClick={testHeavy}
          className="px-3 py-2 bg-red-500 text-white rounded text-sm"
        >
          Test Heavy
        </button>
      </div>
    </div>
  );
}

