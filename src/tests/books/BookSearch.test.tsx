import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookSearch } from '@/components/books/BookSearch';

describe('BookSearch', () => {
  const setup = (onSubmit = vi.fn()) => {
    render(
      <BookSearch
        genreOptions={['Fantasy', 'Sci-Fi']}
        yearOptions={[2020, 2021]}
        onSubmit={onSubmit}
      />
    );

    return { onSubmit };
  };

  it('renders search input and submit button', () => {
    setup();

    expect(
      screen.getByPlaceholderText(/search books by title/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /search/i })
    ).toBeInTheDocument();
  });

  it('updates search input value when typing', () => {
    setup();

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'harry potter' } });

    expect(input.value).toBe('harry potter');
  });

  it('calls onSubmit with correct payload on form submit', () => {
    const onSubmit = vi.fn();
    setup(onSubmit);

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    const form = input.closest('form');
    expect(form).toBeTruthy();

    fireEvent.change(input, { target: { value: 'dune' } });
    fireEvent.submit(form!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      query: 'dune',
      genre: '',
      rating: '',
      year: '',
    });
  });
});
