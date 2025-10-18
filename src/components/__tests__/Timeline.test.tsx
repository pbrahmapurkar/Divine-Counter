import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Timeline } from '../Timeline';
import { MilestoneTimeline } from '../MilestoneTimeline';
import { StreakMilestone } from '../../data/rewards';

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Timeline', () => {
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

  const defaultProps = {
    milestones: mockMilestones,
    currentStreak: 5,
    onMilestoneClick: jest.fn()
  };

  it('renders timeline with milestones', () => {
    render(<Timeline {...defaultProps} />);
    
    expect(screen.getByText('First Spark')).toBeInTheDocument();
    expect(screen.getByText('Weekly Warrior')).toBeInTheDocument();
  });

  it('shows correct status labels', () => {
    render(<Timeline {...defaultProps} />);
    
    expect(screen.getByText('Locked')).toBeInTheDocument();
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
  });

  it('handles milestone clicks', () => {
    const onMilestoneClick = jest.fn();
    render(<Timeline {...defaultProps} onMilestoneClick={onMilestoneClick} />);
    
    const milestoneCard = screen.getByText('First Spark').closest('[role="button"]');
    fireEvent.click(milestoneCard!);
    
    expect(onMilestoneClick).toHaveBeenCalledWith(mockMilestones[0]);
  });

  it('handles keyboard navigation', () => {
    const onMilestoneClick = jest.fn();
    render(<Timeline {...defaultProps} onMilestoneClick={onMilestoneClick} />);
    
    const milestoneCard = screen.getByText('First Spark').closest('[role="button"]');
    fireEvent.keyDown(milestoneCard!, { key: 'Enter' });
    
    expect(onMilestoneClick).toHaveBeenCalledWith(mockMilestones[0]);
  });

  it('shows empty state when no milestones', () => {
    render(<Timeline milestones={[]} currentStreak={0} />);
    
    expect(screen.getByText('Your Journey Awaits')).toBeInTheDocument();
    expect(screen.getByText('Begin your practice to unlock beautiful milestones and track your spiritual growth.')).toBeInTheDocument();
  });
});

describe('MilestoneTimeline', () => {
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

  const defaultProps = {
    currentStreak: 5,
    longestStreak: 10,
    milestones: mockMilestones,
    onMilestoneClick: jest.fn()
  };

  it('renders overview cards', () => {
    render(<MilestoneTimeline {...defaultProps} />);
    
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Longest Streak')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument(); // current streak
    expect(screen.getByText('10')).toBeInTheDocument(); // longest streak
  });

  it('renders timeline section', () => {
    render(<MilestoneTimeline {...defaultProps} />);
    
    expect(screen.getByText('Your Journey Timeline')).toBeInTheDocument();
    expect(screen.getByText('First Spark')).toBeInTheDocument();
    expect(screen.getByText('Weekly Warrior')).toBeInTheDocument();
  });

  it('shows progress message', () => {
    render(<MilestoneTimeline {...defaultProps} />);
    
    expect(screen.getByText(/You're \d+ day.* from your next milestone/)).toBeInTheDocument();
  });

  it('shows empty state when no milestones', () => {
    render(<MilestoneTimeline {...defaultProps} milestones={[]} />);
    
    expect(screen.getByText('Your Journey Awaits')).toBeInTheDocument();
    expect(screen.getByText('Start your first practice')).toBeInTheDocument();
  });

  it('handles milestone clicks', () => {
    const onMilestoneClick = jest.fn();
    render(<MilestoneTimeline {...defaultProps} onMilestoneClick={onMilestoneClick} />);
    
    const milestoneCard = screen.getByText('First Spark').closest('[role="button"]');
    fireEvent.click(milestoneCard!);
    
    expect(onMilestoneClick).toHaveBeenCalledWith(mockMilestones[0]);
  });
});
