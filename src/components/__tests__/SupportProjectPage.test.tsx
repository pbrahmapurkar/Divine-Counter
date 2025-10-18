import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SupportProjectPage } from '../info/SupportProjectPage';

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

// Mock the motion components
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('SupportProjectPage', () => {
  const mockOnBack = jest.fn();
  const mockOnDonate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders both donation buttons', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    expect(screen.getByText('Support on Buy Me a Coffee')).toBeInTheDocument();
    expect(screen.getByText('Donate with PayPal')).toBeInTheDocument();
  });

  it('renders PayPal button with correct styling', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    expect(paypalButton).toHaveClass('bg-[#003087]');
    expect(paypalButton).toHaveClass('text-white');
    expect(paypalButton).toHaveClass('w-full');
    expect(paypalButton).toHaveClass('rounded-xl');
  });

  it('renders Buy Me a Coffee button with correct styling', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    expect(coffeeButton).toHaveClass('bg-[#D4AF37]');
    expect(coffeeButton).toHaveClass('text-black');
    expect(coffeeButton).toHaveClass('w-full');
    expect(coffeeButton).toHaveClass('rounded-xl');
  });

  it('includes wallet and external link icons in PayPal button', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const walletIcon = paypalButton?.querySelector('[data-lucide="wallet"]');
    const externalLinkIcon = paypalButton?.querySelector('[data-lucide="external-link"]');
    
    expect(walletIcon).toBeInTheDocument();
    expect(externalLinkIcon).toBeInTheDocument();
  });

  it('includes coffee and external link icons in Buy Me a Coffee button', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    const coffeeIcon = coffeeButton?.querySelector('[data-lucide="coffee"]');
    const externalLinkIcon = coffeeButton?.querySelector('[data-lucide="external-link"]');
    
    expect(coffeeIcon).toBeInTheDocument();
    expect(externalLinkIcon).toBeInTheDocument();
  });

  it('opens PayPal URL when PayPal button is clicked', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal');
    fireEvent.click(paypalButton);
    
    expect(mockOpen).toHaveBeenCalledWith(
      'https://paypal.me/PBrahmapurkar',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('calls onDonate when Buy Me a Coffee button is clicked', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee');
    fireEvent.click(coffeeButton);
    
    expect(mockOnDonate).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    
    expect(paypalButton).toHaveAttribute('type', 'button');
    expect(coffeeButton).toHaveAttribute('type', 'button');
  });

  it('has proper focus states', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    
    expect(paypalButton).toHaveClass('focus-visible:ring-2');
    expect(paypalButton).toHaveClass('focus-visible:ring-[#003087]/40');
    expect(coffeeButton).toHaveClass('focus-visible:ring-2');
    expect(coffeeButton).toHaveClass('focus-visible:ring-[#D4AF37]/40');
  });

  it('has proper hover states', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    
    expect(paypalButton).toHaveClass('hover:bg-[#012c74]');
    expect(coffeeButton).toHaveClass('hover:bg-[#caa634]');
  });

  it('has proper responsive classes', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    
    expect(paypalButton).toHaveClass('px-4');
    expect(paypalButton).toHaveClass('sm:px-5');
    expect(coffeeButton).toHaveClass('px-4');
    expect(coffeeButton).toHaveClass('sm:px-5');
  });

  it('has minimum height for touch targets', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    const coffeeButton = screen.getByText('Support on Buy Me a Coffee').closest('button');
    
    expect(paypalButton).toHaveClass('min-h-[48px]');
    expect(coffeeButton).toHaveClass('min-h-[48px]');
  });

  it('renders with proper spacing between buttons', () => {
    const { container } = render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const buttonContainer = container.querySelector('.space-y-4');
    expect(buttonContainer).toBeInTheDocument();
  });

  it('has proper dark theme support', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const paypalButton = screen.getByText('Donate with PayPal').closest('button');
    
    expect(paypalButton).toHaveClass('dark:bg-[#003087]');
    expect(paypalButton).toHaveClass('dark:hover:bg-[#012c74]');
  });

  it('renders privacy note', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    expect(screen.getByText(/Privacy note/)).toBeInTheDocument();
    expect(screen.getByText(/Payments are processed by Buy Me a Coffee or PayPal/)).toBeInTheDocument();
  });

  it('renders expandable why donate section', () => {
    render(<SupportProjectPage onBack={mockOnBack} onDonate={mockOnDonate} />);
    
    const whyDonateButton = screen.getByText('Why donate?');
    expect(whyDonateButton).toBeInTheDocument();
    
    fireEvent.click(whyDonateButton);
    expect(screen.getByText(/Your support covers hosting/)).toBeInTheDocument();
  });
});
