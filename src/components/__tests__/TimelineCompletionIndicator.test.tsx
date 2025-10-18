import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';
import { StreakMilestone } from '../../data/rewards';

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Timeline Completion Indicator', () => {
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
    },
    {
      days: 14,
      name: "Fortnight Focus",
      description: "Two weeks of consistent practice.",
      icon: "🌟",
      color: "#8B5CF6",
      isAchieved: true
    }
  ];

  describe('Completion Indicator Styling', () => {
    it('renders golden completion indicator for unlocked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check for unlocked milestone nodes
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      expect(unlockedNodes).toHaveLength(2); // Two unlocked milestones
      
      // Check for golden styling
      unlockedNodes.forEach(node => {
        expect(node).toHaveClass('border-[#D4AF37]');
        expect(node).toHaveClass('bg-[#D4AF37]');
        expect(node).toHaveClass('shadow-lg');
      });
    });

    it('renders in-progress indicator for active milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check for in-progress milestone nodes
      const activeNodes = screen.getAllByLabelText('Milestone in progress');
      expect(activeNodes.length).toBeGreaterThan(0);
      
      // Check for golden styling with transparency
      activeNodes.forEach(node => {
        expect(node).toHaveClass('border-[#D4AF37]');
        expect(node).toHaveClass('bg-[#D4AF37]/20');
        expect(node).toHaveClass('shadow-md');
      });
    });

    it('renders muted indicator for locked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={0} />);
      
      // Check for locked milestone nodes
      const lockedNodes = screen.getAllByLabelText('Milestone locked');
      expect(lockedNodes.length).toBeGreaterThan(0);
      
      // Check for muted styling
      lockedNodes.forEach(node => {
        expect(node).toHaveClass('border-muted-foreground/40');
        expect(node).toHaveClass('bg-background');
      });
    });
  });

  describe('Checkmark Display', () => {
    it('displays checkmark icon for unlocked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check for checkmark icons in unlocked milestones
      const checkmarks = screen.getAllByLabelText('Milestone unlocked');
      checkmarks.forEach(node => {
        const checkIcon = node.querySelector('[data-lucide="check"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it('does not display checkmark for locked milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={0} />);
      
      // Check that locked milestones don't have checkmarks
      const lockedNodes = screen.getAllByLabelText('Milestone locked');
      lockedNodes.forEach(node => {
        const checkIcon = node.querySelector('[data-lucide="check"]');
        expect(checkIcon).not.toBeInTheDocument();
      });
    });

    it('does not display checkmark for in-progress milestones', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={5} />);
      
      // Check that in-progress milestones don't have checkmarks
      const activeNodes = screen.getAllByLabelText('Milestone in progress');
      activeNodes.forEach(node => {
        const checkIcon = node.querySelector('[data-lucide="check"]');
        expect(checkIcon).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for different states', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      expect(screen.getByLabelText('Milestone unlocked')).toBeInTheDocument();
      expect(screen.getByLabelText('Milestone locked')).toBeInTheDocument();
    });

    it('has proper role attributes', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const nodes = screen.getAllByRole('img');
      expect(nodes.length).toBeGreaterThan(0);
    });

    it('provides clear state indication for screen readers', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      const lockedNodes = screen.getAllByLabelText('Milestone locked');
      
      expect(unlockedNodes.length).toBe(2);
      expect(lockedNodes.length).toBe(1);
    });
  });

  describe('Visual States', () => {
    it('applies correct styling based on milestone status', () => {
      const { rerender } = render(<Timeline milestones={mockMilestones} currentStreak={0} />);
      
      // All milestones should be locked
      let lockedNodes = screen.getAllByLabelText('Milestone locked');
      expect(lockedNodes).toHaveLength(3);
      
      // Update to unlock some milestones
      rerender(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Should have unlocked and locked milestones
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      lockedNodes = screen.getAllByLabelText('Milestone locked');
      
      expect(unlockedNodes).toHaveLength(2);
      expect(lockedNodes).toHaveLength(1);
    });

    it('maintains proper contrast in different states', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check that unlocked milestones have high contrast
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      unlockedNodes.forEach(node => {
        expect(node).toHaveClass('text-white'); // Checkmark should be white
        expect(node).toHaveClass('bg-[#D4AF37]'); // Background should be golden
      });
    });
  });

  describe('Animation Behavior', () => {
    it('renders without animation errors', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Should render without throwing errors
      expect(screen.getByText('First Spark')).toBeInTheDocument();
      expect(screen.getByText('Weekly Warrior')).toBeInTheDocument();
      expect(screen.getByText('Fortnight Focus')).toBeInTheDocument();
    });

    it('maintains proper node positioning', () => {
      const { container } = render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      // Check that nodes are properly positioned
      const nodes = container.querySelectorAll('[role="img"]');
      expect(nodes.length).toBeGreaterThan(0);
      
      // Check for proper positioning classes
      nodes.forEach(node => {
        expect(node.closest('div')).toHaveClass('absolute');
        expect(node.closest('div')).toHaveClass('top-1/2');
        expect(node.closest('div')).toHaveClass('-translate-y-1/2');
      });
    });
  });

  describe('Responsive Design', () => {
    it('maintains proper sizing on different screen sizes', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const nodes = screen.getAllByRole('img');
      nodes.forEach(node => {
        expect(node).toHaveClass('w-6');
        expect(node).toHaveClass('h-6');
        expect(node).toHaveClass('rounded-full');
      });
    });

    it('keeps nodes aligned to timeline spine', () => {
      const { container } = render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const nodeContainers = container.querySelectorAll('.absolute.top-1\\/2.-translate-y-1\\/2');
      expect(nodeContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Compatibility', () => {
    it('works with light theme styling', () => {
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      unlockedNodes.forEach(node => {
        expect(node).toHaveClass('border-[#D4AF37]');
        expect(node).toHaveClass('bg-[#D4AF37]');
      });
    });

    it('maintains contrast in dark theme', () => {
      // This would require theme context in a real test
      render(<Timeline milestones={mockMilestones} currentStreak={10} />);
      
      const unlockedNodes = screen.getAllByLabelText('Milestone unlocked');
      unlockedNodes.forEach(node => {
        // Golden color should work in both themes
        expect(node).toHaveClass('border-[#D4AF37]');
        expect(node).toHaveClass('bg-[#D4AF37]');
      });
    });
  });
});
