import { describe, it, expect } from 'vitest';
import { dayKey, derivedMaalas, isBoundaryCross, crossedBelow, getProgressPercent, getTapsToNextBoundary } from '../domain/derived';

describe('derived.ts', () => {
  describe('dayKey', () => {
    it('should return YYYY-MM-DD format', () => {
      const date = new Date('2025-09-14T10:30:00Z');
      const result = dayKey(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use current date when no argument provided', () => {
      const result = dayKey();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('derivedMaalas', () => {
    it('should calculate maalas correctly for 108 cycle', () => {
      expect(derivedMaalas(0, 0, 108)).toBe(0);
      expect(derivedMaalas(107, 0, 108)).toBe(0);
      expect(derivedMaalas(108, 0, 108)).toBe(1);
      expect(derivedMaalas(216, 0, 108)).toBe(2);
    });

    it('should handle manual delta adjustments', () => {
      expect(derivedMaalas(0, 1, 108)).toBe(1);
      expect(derivedMaalas(0, -1, 108)).toBe(0); // Never below 0
      expect(derivedMaalas(108, 1, 108)).toBe(2);
    });

    it('should handle custom cycles', () => {
      expect(derivedMaalas(54, 0, 54)).toBe(1);
      expect(derivedMaalas(27, 0, 27)).toBe(1);
      expect(derivedMaalas(21, 0, 21)).toBe(1);
    });

    it('should handle edge cases', () => {
      expect(derivedMaalas(0, 0, 0)).toBe(0); // Division by zero protection
      expect(derivedMaalas(0, 0, 1)).toBe(0);
      expect(derivedMaalas(1, 0, 1)).toBe(1);
    });
  });

  describe('isBoundaryCross', () => {
    it('should detect boundary crossings correctly', () => {
      expect(isBoundaryCross(107, 108, 108)).toBe(true);
      expect(isBoundaryCross(108, 109, 108)).toBe(false);
      expect(isBoundaryCross(215, 216, 108)).toBe(true);
      expect(isBoundaryCross(0, 1, 108)).toBe(false);
    });

    it('should handle custom cycles', () => {
      expect(isBoundaryCross(53, 54, 54)).toBe(true);
      expect(isBoundaryCross(26, 27, 27)).toBe(true);
      expect(isBoundaryCross(20, 21, 21)).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(isBoundaryCross(0, 0, 108)).toBe(false);
      expect(isBoundaryCross(0, 1, 0)).toBe(false); // Division by zero protection
    });
  });

  describe('crossedBelow', () => {
    it('should detect crossing below boundary', () => {
      expect(crossedBelow(108, 107, 108)).toBe(true);
      expect(crossedBelow(109, 108, 108)).toBe(false);
      expect(crossedBelow(216, 215, 108)).toBe(true);
      expect(crossedBelow(1, 0, 108)).toBe(false);
    });

    it('should handle custom cycles', () => {
      expect(crossedBelow(54, 53, 54)).toBe(true);
      expect(crossedBelow(27, 26, 27)).toBe(true);
      expect(crossedBelow(21, 20, 21)).toBe(true);
    });

    it('should handle edge cases', () => {
      expect(crossedBelow(0, 0, 108)).toBe(false);
      expect(crossedBelow(1, 0, 0)).toBe(false); // Division by zero protection
    });
  });

  describe('getProgressPercent', () => {
    it('should calculate progress percentage correctly', () => {
      expect(getProgressPercent(0, 108)).toBe(0);
      expect(getProgressPercent(54, 108)).toBe(50);
      expect(getProgressPercent(108, 108)).toBe(0); // Reset to 0 after full cycle
      expect(getProgressPercent(162, 108)).toBe(50); // 162 = 108 + 54
    });

    it('should cap at 100%', () => {
      expect(getProgressPercent(200, 108)).toBe(85); // 200 % 108 = 92, 92/108 = 85%
    });
  });

  describe('getTapsToNextBoundary', () => {
    it('should calculate taps to next boundary correctly', () => {
      expect(getTapsToNextBoundary(0, 108)).toBe(108);
      expect(getTapsToNextBoundary(54, 108)).toBe(54);
      expect(getTapsToNextBoundary(107, 108)).toBe(1);
      expect(getTapsToNextBoundary(108, 108)).toBe(108); // Reset to full cycle
    });

    it('should handle custom cycles', () => {
      expect(getTapsToNextBoundary(0, 54)).toBe(54);
      expect(getTapsToNextBoundary(26, 27)).toBe(1);
      expect(getTapsToNextBoundary(20, 21)).toBe(1);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle 107→108 boundary scenario', () => {
      const prevRaw = 107;
      const nextRaw = 108;
      const cycle = 108;
      
      expect(isBoundaryCross(prevRaw, nextRaw, cycle)).toBe(true);
      expect(derivedMaalas(prevRaw, 0, cycle)).toBe(0);
      expect(derivedMaalas(nextRaw, 0, cycle)).toBe(1);
    });

    it('should handle 110→107 below boundary scenario', () => {
      const prevRaw = 110;
      const nextRaw = 107;
      const cycle = 108;
      
      expect(crossedBelow(prevRaw, nextRaw, cycle)).toBe(true);
      expect(derivedMaalas(prevRaw, 0, cycle)).toBe(1);
      expect(derivedMaalas(nextRaw, 0, cycle)).toBe(0);
    });

    it('should handle manual delta math', () => {
      const raw = 50;
      const delta = 2;
      const cycle = 108;
      
      expect(derivedMaalas(raw, delta, cycle)).toBe(2); // 0 + 2 = 2
      
      // Add more raw counts
      const newRaw = 108;
      expect(derivedMaalas(newRaw, delta, cycle)).toBe(3); // 1 + 2 = 3
    });
  });
});
