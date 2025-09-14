import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomCycleTile } from '../components/counter-cycle/CustomCycleTile';

describe('CustomCycleTile', () => {
  it('should render custom tile with correct initial state', () => {
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value=""
        onImmediateValid={mockOnImmediateValid}
        selected={false}
        min={1}
        max={1000}
      />
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Enter your preferred count')).toBeInTheDocument();
  });

  it('should expand when clicked and auto-focus input', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value=""
        onImmediateValid={mockOnImmediateValid}
        selected={false}
        min={1}
        max={1000}
      />
    );

    const tile = screen.getByRole('button');
    await user.click(tile);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('should call onChange immediately when valid number is entered', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value=""
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '120');

    expect(mockOnImmediateValid).toHaveBeenCalledWith(120);
  });

  it('should show error for out-of-range values', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value=""
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '0');

    expect(screen.getByText('Range 1–1000')).toBeInTheDocument();
    expect(mockOnImmediateValid).not.toHaveBeenCalled();
  });

  it('should revert to last valid value on blur with invalid input', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value={120}
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '0');
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(input).toHaveValue('120');
    });
  });

  it('should handle stepper buttons correctly', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value={50}
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const increaseButton = screen.getByLabelText('Increase');
    const decreaseButton = screen.getByLabelText('Decrease');

    await user.click(increaseButton);
    expect(mockOnImmediateValid).toHaveBeenCalledWith(51);

    await user.click(decreaseButton);
    expect(mockOnImmediateValid).toHaveBeenCalledWith(50);
  });

  it('should respect min/max bounds in stepper', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value={1}
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const decreaseButton = screen.getByLabelText('Decrease');
    await user.click(decreaseButton);

    // Should not go below min
    expect(mockOnImmediateValid).not.toHaveBeenCalledWith(0);
  });

  it('should show checkmark when valid value is selected', () => {
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value={120}
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockOnImmediateValid = vi.fn();
    render(
      <CustomCycleTile
        value={50}
        onImmediateValid={mockOnImmediateValid}
        selected={true}
        min={1}
        max={1000}
      />
    );

    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{ArrowUp}');

    expect(mockOnImmediateValid).toHaveBeenCalledWith(51);

    await user.keyboard('{ArrowDown}');
    expect(mockOnImmediateValid).toHaveBeenCalledWith(50);
  });
});
