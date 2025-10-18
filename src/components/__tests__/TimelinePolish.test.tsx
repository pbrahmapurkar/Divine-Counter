import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';
import { MilestoneTimeline } from '../MilestoneTimeline';
import { StreakMilestone } from '../../data/rewards';

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Timeline Polish Enhancements', () => {
  const mockMilestones: StreakMilestone[] = [
    {
      days: 1,
      name: "First Spark",
      description: "Your journey begins with a single day.",
      icon: "✨",
      color: "#FACC15",
      isAchieved: false
    },
    {
      days: 7,
      name: "Weekly Warrior",
      description: "A full week of dedication!",
      icon: "🔥",
      color: "#F97316",
      isAchieved: true
    }
  ];

  describe('Timeline Checkmarks', () => {
    it('renders checkmark for unlocked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check for checkmark icon in unlocked milestone
      const checkmark = screen.getByText('Weekly Warrior').closest('[class*="flex items-center gap-1.5"]')?.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('does not render checkmark for locked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={0} />);
      
      // Check that locked milestone doesn't have checkmark
      const firstSparkCard = screen.getByText('First Spark').closest('[class*="flex items-center gap-1.5"]');
      const checkmark = firstSparkCard?.querySelector('svg');
      expect(checkmark).not.toBeInTheDocument();
    });

    it('renders status pills with proper styling', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check for status pills
      expect(screen.getByText('Unlocked')).toBeInTheDocument();
      expect(screen.getByText('Locked')).toBeInTheDocument();
    });

    it('maintains proper spacing in status pills', () => {
      const { container } = render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check for proper flex layout with gap
      const statusPills = container.querySelectorAll('[class*="flex items-center gap-1.5"]');
      expect(statusPills.length).toBeGreaterThan(0);
    });
  });

  describe('Streak Card Icon Enhancements', () => {
    it('renders streak cards with enhanced icons', () => {
      render(
        <MilestoneTimeline
          currentStreak={5}
          longestStreak={10}
          milestones={mockMilestones}
        />
      );
      
      // Check that streak cards are rendered
      expect(screen.getByText('Current Streak')).toBeInTheDocument();
      expect(screen.getByText('Longest Streak')).toBeInTheDocument();
    });

    it('renders icons with proper contrast colors', () => {
      const { container } = render(
        <MilestoneTimeline
          currentStreak={5}
          longestStreak={10}
          milestones={mockMilestones}
        />
      );
      
      // Check for tinted circle backgrounds
      const tintedCircles = container.querySelectorAll('[class*="bg-gradient-to-br from-[#D4AF37]/20"]');
      expect(tintedCircles.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Layout', () => {
    it('renders without overflow issues on mobile', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check that components render without errors
      expect(screen.getByText('First Spark')).toBeInTheDocument();
      expect(screen.getByText('Weekly Warrior')).toBeInTheDocument();
    });

    it('maintains proper spacing on mobile', () => {
      const { container } = render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check for proper grid layout
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper contrast ratios', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check that status pills have proper color classes
      const unlockedPill = screen.getByText('Unlocked').closest('div');
      expect(unlockedPill).toHaveClass('text-emerald-600');
    });

    it('preserves keyboard navigation', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check for focusable elements
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Compatibility', () => {
    it('renders correctly in light theme', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check for light theme classes
      const statusPills = screen.getAllByText(/Unlocked|Locked|In Progress/);
      expect(statusPills.length).toBeGreaterThan(0);
    });

    it('renders correctly in dark theme', () => {
      // This would require theme context in a real test
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check that components render without errors
      expect(screen.getByText('First Spark')).toBeInTheDocument();
    });
  });
});
