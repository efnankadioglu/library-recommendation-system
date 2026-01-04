import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookSearch } from '@/components/books/BookSearch';

describe('BookSearch – full coverage', () => {
  const genreOptions = ['Fantasy', 'Sci-Fi'];
  const yearOptions = [2020, 2021];

  const setup = (onSubmit = vi.fn()) => {
    render(
      <BookSearch
        genreOptions={genreOptions}
        yearOptions={yearOptions}
        onSubmit={onSubmit}
      />
    );
    return { onSubmit };
  };

  it('renders input, selects and submit button', () => {
    setup();

    expect(
      screen.getByPlaceholderText(/search books by title/i)
    ).toBeInTheDocument();

    expect(screen.getAllByRole('combobox')).toHaveLength(3);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates search query when typing', () => {
    setup();

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'harry potter' } });
    expect(input.value).toBe('harry potter');
  });

  it('renders dynamic genre and year options', () => {
    setup();

    expect(screen.getByRole('option', { name: 'Fantasy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Sci-Fi' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2020' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '2021' })).toBeInTheDocument();
  });

  it('updates genre, rating and year selections', () => {
    setup();

    const [genreSelect, ratingSelect, yearSelect] =
      screen.getAllByRole('combobox') as HTMLSelectElement[];

    fireEvent.change(genreSelect, { target: { value: 'Fantasy' } });
    fireEvent.change(ratingSelect, { target: { value: '4.5' } });
    fireEvent.change(yearSelect, { target: { value: '2021' } });

    expect(genreSelect.value).toBe('Fantasy');
    expect(ratingSelect.value).toBe('4.5');
    expect(yearSelect.value).toBe('2021');
  });

  it('calls onSubmit with full payload when submitted', () => {
    const onSubmit = vi.fn();
    setup(onSubmit);

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    const [genreSelect, ratingSelect, yearSelect] =
      screen.getAllByRole('combobox') as HTMLSelectElement[];

    fireEvent.change(input, { target: { value: 'Dune' } });
    fireEvent.change(genreSelect, { target: { value: 'Sci-Fi' } });
    fireEvent.change(ratingSelect, { target: { value: '4.0' } });
    fireEvent.change(yearSelect, { target: { value: '2020' } });

    fireEvent.submit(input.closest('form')!);

    expect(onSubmit).toHaveBeenCalledWith({
      query: 'Dune',
      genre: 'Sci-Fi',
      rating: '4.0',
      year: '2020',
    });
  });

  it('submits empty filters correctly', () => {
    const onSubmit = vi.fn();
    setup(onSubmit);

    fireEvent.submit(
      screen.getByPlaceholderText(/search books by title/i).closest('form')!
    );

    expect(onSubmit).toHaveBeenCalledWith({
      query: '',
      genre: '',
      rating: '',
      year: '',
    });
  });
});
