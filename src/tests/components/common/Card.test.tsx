import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/common/Card';

describe('Card Component – full coverage', () => {
  it('renders children content', () => {
    render(
      <Card>
        <h3>Card Title</h3>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('calls onClick when clicked and hoverable', () => {
    const handleClick = vi.fn();

    render(
      <Card hoverable onClick={handleClick}>
        Click me
      </Card>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT throw when clicked without onClick', () => {
    render(<Card>Safe Click</Card>);

    expect(() => {
      fireEvent.click(screen.getByText('Safe Click'));
    }).not.toThrow();
  });

  it('applies hover classes when hoverable is true', () => {
    const { container } = render(<Card hoverable>Hoverable</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('hover:shadow-2xl');
    expect(card).toHaveClass('hover:-translate-y-1');
    expect(card).toHaveClass('hover:border-violet-300');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies non-hover transition classes when hoverable is false', () => {
    const { container } = render(<Card>Static</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('duration-300');
    expect(card).not.toHaveClass('hover:shadow-2xl');
  });

  it('applies default (non-gradient) base classes when gradient is false', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('bg-white/90');
    expect(card).toHaveClass('backdrop-blur-sm');
    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('shadow-lg');
    expect(card).toHaveClass('border');
  });

  it('applies gradient base class when gradient is true', () => {
    const { container } = render(<Card gradient>Gradient</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('card-gradient');
    expect(card).not.toHaveClass('bg-white/90');
  });

  it('merges custom className correctly', () => {
    const { container } = render(
      <Card className="custom-class another-class">
        Custom Class
      </Card>
    );

    const card = container.firstChild as HTMLElement;

    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('another-class');
  });
});
