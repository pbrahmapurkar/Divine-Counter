import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';
import { gentleHaptic } from '../../utils/haptics';

// Mock the haptics module
jest.mock('../../utils/haptics', () => ({
  gentleHaptic: jest.fn()
}));

// Mock window.matchMedia for accessibility testing
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia
});

describe('BottomNavigation Haptic Feedback', () => {
  const mockOnNavigate = jest.fn();
  const mockGentleHaptic = gentleHaptic as jest.MockedFunction<typeof gentleHaptic>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should trigger haptic feedback when haptics are enabled', async () => {
    jest.useFakeTimers();
    
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={true}
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    fireEvent.click(homeButton);

    // Fast-forward timers to trigger the debounced haptic
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).toHaveBeenCalledTimes(1);
    });

    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  it('should not trigger haptic feedback when haptics are disabled', async () => {
    jest.useFakeTimers();
    
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={false}
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    fireEvent.click(homeButton);

    // Fast-forward timers
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).not.toHaveBeenCalled();
    });

    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  it('should not trigger haptic feedback when reduced motion is preferred', async () => {
    jest.useFakeTimers();
    
    // Mock reduced motion preference
    mockMatchMedia.mockReturnValue({
      matches: true, // prefers-reduced-motion: reduce
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });

    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={true}
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    fireEvent.click(homeButton);

    // Fast-forward timers
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).not.toHaveBeenCalled();
    });

    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  it('should debounce rapid taps and only trigger haptic once', async () => {
    jest.useFakeTimers();
    
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={true}
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    
    // Rapid clicks
    fireEvent.click(homeButton);
    fireEvent.click(homeButton);
    fireEvent.click(homeButton);

    // Fast-forward timers
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).toHaveBeenCalledTimes(1);
    });

    expect(mockOnNavigate).toHaveBeenCalledTimes(3);
  });

  it('should handle haptic errors gracefully', async () => {
    jest.useFakeTimers();
    
    // Mock haptic function to throw an error
    mockGentleHaptic.mockRejectedValueOnce(new Error('Haptic not available'));

    // Mock console.debug to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={true}
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    fireEvent.click(homeButton);

    // Fast-forward timers
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).toHaveBeenCalledTimes(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Haptic feedback not available:', expect.any(Error));
    expect(mockOnNavigate).toHaveBeenCalledWith('home');

    consoleSpy.mockRestore();
  });

  it('should work with all navigation items', async () => {
    jest.useFakeTimers();
    
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        hapticsEnabled={true}
      />
    );

    const navItems = ['Home', 'Journey', 'Counters', 'Settings'];
    
    for (const item of navItems) {
      const button = screen.getByLabelText(`Navigate to ${item}`);
      fireEvent.click(button);
      
      // Fast-forward timers
      jest.advanceTimersByTime(50);
      
      await waitFor(() => {
        expect(mockGentleHaptic).toHaveBeenCalled();
      });
      
      expect(mockOnNavigate).toHaveBeenCalledWith(item.toLowerCase());
      
      // Clear mocks for next iteration
      jest.clearAllMocks();
    }
  });

  it('should default to haptics enabled when prop is not provided', async () => {
    jest.useFakeTimers();
    
    render(
      <BottomNavigation
        activeScreen="home"
        onNavigate={mockOnNavigate}
        // hapticsEnabled prop not provided
      />
    );

    const homeButton = screen.getByLabelText('Navigate to Home');
    fireEvent.click(homeButton);

    // Fast-forward timers
    jest.advanceTimersByTime(50);

    await waitFor(() => {
      expect(mockGentleHaptic).toHaveBeenCalledTimes(1);
    });

    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });
});
