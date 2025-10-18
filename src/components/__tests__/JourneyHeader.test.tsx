import React from 'react';
import { render, screen } from '@testing-library/react';
import { JourneyHeader } from '../JourneyHeader';
import { StreakMilestone } from '../../data/rewards';

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('JourneyHeader', () => {
  const mockMilestone: StreakMilestone = {
    days: 7,
    name: "Weekly Warrior",
    description: "A full week of dedication!",
    icon: "🔥",
    color: "#F97316",
    isAchieved: false
  };

  const defaultProps = {
    currentStreak: 5,
    totalMilestonesUnlocked: 2,
    nextMilestone: mockMilestone,
    userName: "Test User"
  };

  it('renders greeting with user name', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    // Check for time-based greeting
    const greeting = screen.getByText(/Good (morning|afternoon|evening), Test User/);
    expect(greeting).toBeInTheDocument();
  });

  it('renders all four metrics in 2x2 grid', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    // Check all four metrics are present
    expect(screen.getByText('5')).toBeInTheDocument(); // current streak
    expect(screen.getByText('2')).toBeInTheDocument(); // total milestones
    expect(screen.getByText('3')).toBeInTheDocument(); // early momentum (calculated)
    expect(screen.getByText('2')).toBeInTheDocument(); // next milestone remaining
    
    // Check labels
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
    expect(screen.getByText('Early Momentum')).toBeInTheDocument();
    expect(screen.getByText('Weekly Warrior')).toBeInTheDocument();
  });

  it('calculates early momentum correctly', () => {
    const { rerender } = render(<JourneyHeader {...defaultProps} currentStreak={0} />);
    expect(screen.getByText('0')).toBeInTheDocument(); // momentum for 0 streak

    rerender(<JourneyHeader {...defaultProps} currentStreak={1} />);
    expect(screen.getByText('1')).toBeInTheDocument(); // just started

    rerender(<JourneyHeader {...defaultProps} currentStreak={3} />);
    expect(screen.getByText('2')).toBeInTheDocument(); // building momentum

    rerender(<JourneyHeader {...defaultProps} currentStreak={7} />);
    expect(screen.getByText('3')).toBeInTheDocument(); // strong momentum

    rerender(<JourneyHeader {...defaultProps} currentStreak={15} />);
    expect(screen.getByText('4')).toBeInTheDocument(); // excellent momentum
  });

  it('shows progress bar for next milestone', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    expect(screen.getByText('Progress to Weekly Warrior')).toBeInTheDocument();
    expect(screen.getByText('5 / 7 days')).toBeInTheDocument();
  });

  it('shows celebration message when all milestones achieved', () => {
    render(<JourneyHeader {...defaultProps} nextMilestone={null} />);
    
    expect(screen.getByText('All milestones achieved! 🌟')).toBeInTheDocument();
  });

  it('shows appropriate progress message for different streak lengths', () => {
    const { rerender } = render(<JourneyHeader {...defaultProps} currentStreak={0} />);
    expect(screen.getByText('Ready to begin your mindful journey')).toBeInTheDocument();

    rerender(<JourneyHeader {...defaultProps} currentStreak={1} />);
    expect(screen.getByText('Your journey has begun')).toBeInTheDocument();

    rerender(<JourneyHeader {...defaultProps} currentStreak={3} />);
    expect(screen.getByText('Building beautiful momentum')).toBeInTheDocument();

    rerender(<JourneyHeader {...defaultProps} currentStreak={15} />);
    expect(screen.getByText('Your dedication is inspiring')).toBeInTheDocument();

    rerender(<JourneyHeader {...defaultProps} currentStreak={50} />);
    expect(screen.getByText('Your practice radiates wisdom')).toBeInTheDocument();
  });

  it('renders with proper grid classes', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    // Check for grid container
    const gridContainer = container.querySelector('.grid.grid-cols-1.min-\\[320px\\]\\:grid-cols-2.sm\\:grid-cols-2.lg\\:grid-cols-4');
    expect(gridContainer).toBeInTheDocument();
  });

  it('renders metric cards with proper styling', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    // Check for metric cards with backdrop blur and rounded corners
    const metricCards = container.querySelectorAll('.bg-white\\/40.dark\\:bg-white\\/5.rounded-2xl');
    expect(metricCards).toHaveLength(4);
  });

  it('handles very narrow screens with single column', () => {
    // This test would require viewport manipulation in a real browser
    // For now, we verify the classes are present
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
  });
});