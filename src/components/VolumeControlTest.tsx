import React, { useState, useEffect } from 'react';
import { VolumeButtons } from '@capacitor-community/volume-buttons';

interface VolumeControlTestProps {
  volumeKeyControl: boolean;
}

export function VolumeControlTest({ volumeKeyControl }: VolumeControlTestProps) {
  const [isListening, setIsListening] = useState(false);
  const [lastEvent, setLastEvent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!volumeKeyControl) {
      setIsListening(false);
      setError('');
      return;
    }

    let listener: any = null;

    const setupTest = async () => {
      try {
        setError('');
        await VolumeButtons.startListening();
        
        listener = await VolumeButtons.addListener('volumeButtonPressed', (event) => {
          setLastEvent(`${event.direction} - ${new Date().toLocaleTimeString()}`);
        });
        
        setIsListening(true);
      } catch (err) {
        setError(`Setup failed: ${err}`);
        setIsListening(false);
      }
    };

    setupTest();

    return () => {
      if (listener) {
        try {
          VolumeButtons.removeAllListeners();
          VolumeButtons.stopListening();
        } catch (err) {
          console.warn('Cleanup error:', err);
        }
      }
    };
  }, [volumeKeyControl]);

  const testVolumeButtons = async () => {
    try {
      setError('');
      await VolumeButtons.startListening();
      setIsListening(true);
    } catch (err) {
      setError(`Test failed: ${err}`);
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="text-lg font-semibold mb-4">Volume Control Test</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <span className={`text-sm px-2 py-1 rounded ${
            volumeKeyControl 
              ? (isListening ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')
              : 'bg-gray-100 text-gray-600'
          }`}>
            {volumeKeyControl 
              ? (isListening ? 'Listening' : 'Not Listening') 
              : 'Disabled'
            }
          </span>
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        {lastEvent && (
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Last event: {lastEvent}
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Press Volume UP to increment counter</li>
            <li>Press Volume DOWN to decrement counter</li>
            <li>Test on real device (not emulator)</li>
            <li>Check console for detailed logs</li>
          </ul>
        </div>
        
        {volumeKeyControl && !isListening && (
          <button
            onClick={testVolumeButtons}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
          >
            Test Volume Buttons
          </button>
        )}
      </div>
    </div>
  );
}

