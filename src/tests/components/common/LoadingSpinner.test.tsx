import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders with default props (md size, default color)', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('w-8', 'h-8');
    expect(spinner).toHaveClass('text-primary-600');
    expect(spinner).toHaveClass('animate-spin');
  });

  test('renders small size correctly', () => {
    render(<LoadingSpinner size="sm" />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  test('renders large size correctly', () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('w-12', 'h-12');
  });

  test('applies custom color class', () => {
    render(<LoadingSpinner color="text-red-500" />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass('text-red-500');
  });

  test('has correct border classes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveClass(
      'rounded-full',
      'border-4',
      'border-gray-200',
      'border-t-current'
    );
  });
});
