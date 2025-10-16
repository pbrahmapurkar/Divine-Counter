/**
 * Test utilities for verifying the daily archiving logic
 * This file can be used for manual testing and debugging
 */

export interface TestScenario {
  name: string;
  description: string;
  setup: () => {
    counterStates: { [key: string]: any };
    history: any[];
    currentDate: string;
  };
  expectedResult: {
    shouldArchive: boolean;
    archivedCount?: number;
    newTodayProgress: number;
    newLastCountDate: string;
  };
}

export const testScenarios: TestScenario[] = [
  {
    name: "Same Day - No Archiving",
    description: "When user counts on the same day, no archiving should occur",
    setup: () => ({
      counterStates: {
        "counter1": {
          currentCount: 5,
          todayProgress: 2,
          lastCountDate: new Date().toDateString()
        }
      },
      history: [],
      currentDate: new Date().toDateString()
    }),
    expectedResult: {
      shouldArchive: false,
      newTodayProgress: 2,
      newLastCountDate: new Date().toDateString()
    }
  },
  {
    name: "New Day - With Progress",
    description: "When a new day starts and yesterday had progress, it should be archived",
    setup: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        counterStates: {
          "counter1": {
            currentCount: 0,
            todayProgress: 3,
            lastCountDate: yesterday.toDateString()
          }
        },
        history: [],
        currentDate: new Date().toDateString()
      };
    },
    expectedResult: {
      shouldArchive: true,
      archivedCount: 3,
      newTodayProgress: 0,
      newLastCountDate: new Date().toDateString()
    }
  },
  {
    name: "New Day - No Progress",
    description: "When a new day starts but yesterday had no progress, no archiving should occur",
    setup: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        counterStates: {
          "counter1": {
            currentCount: 0,
            todayProgress: 0,
            lastCountDate: yesterday.toDateString()
          }
        },
        history: [],
        currentDate: new Date().toDateString()
      };
    },
    expectedResult: {
      shouldArchive: false,
      newTodayProgress: 0,
      newLastCountDate: new Date().toDateString()
    }
  },
  {
    name: "Multiple Days Gap",
    description: "When there's a gap of multiple days, only the most recent day should be archived",
    setup: () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return {
        counterStates: {
          "counter1": {
            currentCount: 0,
            todayProgress: 2,
            lastCountDate: threeDaysAgo.toDateString()
          }
        },
        history: [],
        currentDate: new Date().toDateString()
      };
    },
    expectedResult: {
      shouldArchive: true,
      archivedCount: 2,
      newTodayProgress: 0,
      newLastCountDate: new Date().toDateString()
    }
  }
];

export const logTestResult = (scenario: TestScenario, actual: any, passed: boolean) => {
  console.group(`🧪 Test: ${scenario.name}`);
  console.log(`📝 Description: ${scenario.description}`);
  console.log(`✅ Expected:`, scenario.expectedResult);
  console.log(`🔍 Actual:`, actual);
  console.log(`🎯 Result: ${passed ? 'PASSED' : 'FAILED'}`);
  console.groupEnd();
};

export const simulateDateChange = (daysOffset: number) => {
  const originalDate = Date;
  const mockDate = new Date();
  mockDate.setDate(mockDate.getDate() + daysOffset);
  
  // @ts-ignore
  global.Date = jest.fn(() => mockDate);
  // @ts-ignore
  global.Date.UTC = originalDate.UTC;
  // @ts-ignore
  global.Date.parse = originalDate.parse;
  // @ts-ignore
  global.Date.now = originalDate.now;
  
  return () => {
    global.Date = originalDate;
  };
};

export const createMockState = (overrides: any = {}) => ({
  counterStates: {
    "test-counter": {
      currentCount: 0,
      todayProgress: 0,
      lastCountDate: new Date().toDateString(),
      ...overrides.counterStates?.["test-counter"]
    },
    ...overrides.counterStates
  },
  history: [],
  ...overrides
});

/**
 * Manual testing instructions:
 * 
 * 1. Open browser dev tools console
 * 2. Import this file: import { testScenarios, logTestResult } from './testArchiving'
 * 3. Run tests manually by calling the archiving function with different scenarios
 * 4. Check console logs for test results
 * 
 * Example usage:
 * ```javascript
 * // Test scenario 1
 * const scenario = testScenarios[0];
 * const setup = scenario.setup();
 * // Call your archiving function with setup data
 * // Compare results with scenario.expectedResult
 * ```
 */











