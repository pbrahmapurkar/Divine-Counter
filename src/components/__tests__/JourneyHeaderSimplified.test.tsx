import React from 'react';
import { render, screen } from '@testing-library/react';
import { JourneyHeader } from '../JourneyHeader';

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe('JourneyHeader Simplified', () => {
  const defaultProps = {
    currentStreak: 5,
    totalMilestonesUnlocked: 3,
    userName: 'Pratik',
  };

  it('renders greeting text without blur effects', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    const greeting = screen.getByText(/Good (morning|afternoon|evening), Pratik/);
    expect(greeting).toBeInTheDocument();
    expect(greeting).toHaveClass('text-foreground');
    expect(greeting).not.toHaveClass('text-transparent');
    expect(greeting).not.toHaveClass('bg-clip-text');
  });

  it('renders only two stat cards', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    // Should have Day Streak and Milestones only
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
    
    // Should not have Early Momentum or Next Milestone
    expect(screen.queryByText('Early Momentum')).not.toBeInTheDocument();
    expect(screen.queryByText('Next Milestone')).not.toBeInTheDocument();
  });

  it('renders Day Streak card with correct values', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // currentStreak value
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
  });

  it('renders Milestones card with correct values', () => {
    render(<JourneyHeader {...defaultProps} />);
    
    expect(screen.getByText('3')).toBeInTheDocument(); // totalMilestonesUnlocked value
    expect(screen.getByText('Milestones')).toBeInTheDocument();
  });

  it('uses two-column grid layout', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('sm:grid-cols-2');
    expect(gridContainer).toHaveClass('max-w-2xl');
  });

  it('renders without backdrop blur on main container', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    const mainContainer = container.querySelector('.relative.overflow-hidden.rounded-3xl');
    expect(mainContainer).not.toHaveClass('backdrop-blur-sm');
  });

  it('renders greeting based on time of day', () => {
    // Mock different hours
    const originalDate = Date;
    const mockDate = jest.fn(() => new originalDate('2024-01-01T09:00:00Z')); // 9 AM
    global.Date = mockDate as any;
    
    render(<JourneyHeader {...defaultProps} />);
    expect(screen.getByText('Good morning, Pratik')).toBeInTheDocument();
    
    // Test afternoon
    mockDate.mockImplementation(() => new originalDate('2024-01-01T15:00:00Z')); // 3 PM
    render(<JourneyHeader {...defaultProps} />);
    expect(screen.getByText('Good afternoon, Pratik')).toBeInTheDocument();
    
    // Test evening
    mockDate.mockImplementation(() => new originalDate('2024-01-01T20:00:00Z')); // 8 PM
    render(<JourneyHeader {...defaultProps} />);
    expect(screen.getByText('Good evening, Pratik')).toBeInTheDocument();
    
    global.Date = originalDate;
  });

  it('renders appropriate progress message based on streak', () => {
    // Test zero streak
    render(<JourneyHeader {...defaultProps} currentStreak={0} />);
    expect(screen.getByText('Ready to begin your mindful journey')).toBeInTheDocument();
    
    // Test first day
    render(<JourneyHeader {...defaultProps} currentStreak={1} />);
    expect(screen.getByText('Your journey has begun')).toBeInTheDocument();
    
    // Test building momentum
    render(<JourneyHeader {...defaultProps} currentStreak={3} />);
    expect(screen.getByText('Building beautiful momentum')).toBeInTheDocument();
    
    // Test inspiring dedication
    render(<JourneyHeader {...defaultProps} currentStreak={15} />);
    expect(screen.getByText('Your dedication is inspiring')).toBeInTheDocument();
    
    // Test wisdom
    render(<JourneyHeader {...defaultProps} currentStreak={35} />);
    expect(screen.getByText('Your practice radiates wisdom')).toBeInTheDocument();
  });

  it('renders with proper spacing and layout', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    // Check for proper spacing classes
    const headerText = container.querySelector('.text-center.mb-6');
    expect(headerText).toBeInTheDocument();
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('gap-4');
    expect(gridContainer).toHaveClass('sm:gap-6');
  });

  it('renders stat cards with proper styling', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    const statCards = container.querySelectorAll('.text-center.group.bg-white\\/40');
    expect(statCards).toHaveLength(2); // Only two cards
    
    // Check for proper card styling
    statCards.forEach(card => {
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('p-4');
      expect(card).toHaveClass('sm:p-5');
    });
  });

  it('renders icons with proper styling', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    // Check for flame icon (Day Streak)
    const flameIcon = container.querySelector('[data-lucide="flame"]');
    expect(flameIcon).toBeInTheDocument();
    
    // Check for sparkles icon (Milestones)
    const sparklesIcon = container.querySelector('[data-lucide="sparkles"]');
    expect(sparklesIcon).toBeInTheDocument();
  });

  it('handles different user names', () => {
    render(<JourneyHeader {...defaultProps} userName="Alice" />);
    expect(screen.getByText(/Good (morning|afternoon|evening), Alice/)).toBeInTheDocument();
  });

  it('handles zero milestones', () => {
    render(<JourneyHeader {...defaultProps} totalMilestonesUnlocked={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
  });

  it('handles high milestone counts', () => {
    render(<JourneyHeader {...defaultProps} totalMilestonesUnlocked={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Milestones')).toBeInTheDocument();
  });

  it('maintains responsive design', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('sm:grid-cols-2');
  });

  it('renders without progress bar or celebration message', () => {
    const { container } = render(<JourneyHeader {...defaultProps} />);
    
    // Should not have progress bar
    expect(container.querySelector('.w-full.bg-muted\\/30.rounded-full')).not.toBeInTheDocument();
    
    // Should not have celebration message
    expect(screen.queryByText('All milestones achieved!')).not.toBeInTheDocument();
  });
});
