/**
 * Test utilities for the haptic feedback system
 * Use this to verify haptic patterns work correctly
 */

import { HapticsService } from './haptics';

export class HapticTester {
  /**
   * Test all haptic patterns
   * Call this function to test each haptic type
   */
  static async testAllPatterns() {
    console.log('🧪 Testing Haptic Feedback System...');
    
    try {
      // Test tap haptics
      console.log('1. Testing tap haptics (light, sharp tap)...');
      await HapticsService.tap();
      await this.delay(1000);
      
      // Test completion haptics
      console.log('2. Testing completion haptics (celebratory pattern)...');
      await HapticsService.completion();
      await this.delay(1000);
      
      // Test action haptics
      console.log('3. Testing action haptics (medium tap)...');
      await HapticsService.action();
      await this.delay(1000);
      
      // Test legacy methods
      console.log('4. Testing legacy methods...');
      await HapticsService.light();
      await this.delay(500);
      await HapticsService.medium();
      await this.delay(500);
      await HapticsService.heavy();
      
      console.log('✅ All haptic patterns tested successfully!');
    } catch (error) {
      console.error('❌ Haptic test failed:', error);
    }
  }

  /**
   * Test specific haptic pattern
   */
  static async testPattern(pattern: 'tap' | 'completion' | 'action' | 'light' | 'medium' | 'heavy') {
    console.log(`🧪 Testing ${pattern} haptic pattern...`);
    
    try {
      switch (pattern) {
        case 'tap':
          await HapticsService.tap();
          break;
        case 'completion':
          await HapticsService.completion();
          break;
        case 'action':
          await HapticsService.action();
          break;
        case 'light':
          await HapticsService.light();
          break;
        case 'medium':
          await HapticsService.medium();
          break;
        case 'heavy':
          await HapticsService.heavy();
          break;
        default:
          console.error('Unknown pattern:', pattern);
          return;
      }
      console.log(`✅ ${pattern} haptic pattern tested successfully!`);
    } catch (error) {
      console.error(`❌ ${pattern} haptic test failed:`, error);
    }
  }

  /**
   * Test haptic feedback with settings check
   */
  static async testWithSettings(settings: { hapticFeedback: boolean }) {
    console.log('🧪 Testing haptic feedback with settings...');
    console.log('Settings:', settings);
    
    if (settings.hapticFeedback) {
      await this.testAllPatterns();
    } else {
      console.log('⚠️ Haptic feedback is disabled in settings');
    }
  }

  /**
   * Simulate app actions with haptics
   */
  static async simulateAppActions(settings: { hapticFeedback: boolean }) {
    console.log('🎮 Simulating app actions with haptics...');
    
    if (!settings.hapticFeedback) {
      console.log('⚠️ Haptic feedback is disabled');
      return;
    }

    // Simulate counting
    console.log('Simulating counting...');
    for (let i = 0; i < 3; i++) {
      await HapticsService.tap();
      await this.delay(300);
    }
    
    // Simulate completion
    console.log('Simulating mala completion...');
    await HapticsService.completion();
    await this.delay(1000);
    
    // Simulate actions
    console.log('Simulating key actions...');
    await HapticsService.action(); // Reset
    await this.delay(500);
    await HapticsService.action(); // Delete
    await this.delay(500);
    await HapticsService.action(); // Undo
    
    console.log('✅ App action simulation complete!');
  }

  /**
   * Utility method for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Manual testing instructions:
 * 
 * 1. Open browser dev tools console
 * 2. Import this file: import { HapticTester } from './testHaptics'
 * 3. Run tests:
 * 
 * ```javascript
 * // Test all patterns
 * await HapticTester.testAllPatterns();
 * 
 * // Test specific pattern
 * await HapticTester.testPattern('tap');
 * 
 * // Test with settings
 * await HapticTester.testWithSettings({ hapticFeedback: true });
 * 
 * // Simulate app actions
 * await HapticTester.simulateAppActions({ hapticFeedback: true });
 * ```
 * 
 * 4. Test on real device for best results
 * 5. Check console for test results and any errors
 */



