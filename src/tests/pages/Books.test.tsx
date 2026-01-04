// src/tests/pages/Books.test.tsx
// SADECE DOSYA – AÇIKLAMA YOK

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Books } from '@/pages/Books';

import * as api from '@/services/api';
import * as errorUtils from '@/utils/errorHandling';

vi.mock('@/services/api', () => ({
  getBooks: vi.fn(),
}));

vi.mock('@/utils/errorHandling', () => ({
  handleApiError: vi.fn(),
}));

vi.mock('@/components/books/BookSearch', () => ({
  BookSearch: ({ onSubmit }: any) => (
    <button
      onClick={() =>
        onSubmit({
          query: 'alpha',
          genre: '',
          rating: '',
          year: '',
        })
      }
    >
      Search
    </button>
  ),
}));

vi.mock('@/components/books/BookGrid', () => ({
  BookGrid: ({ books }: any) => (
    <div data-testid="book-grid">
      {books.map((b: any) => (
        <div key={b.bookId}>{b.title}</div>
      ))}
    </div>
  ),
}));

const mockBooks = [
  {
    bookId: '1',
    title: 'Alpha',
    author: 'Author A',
    genre: 'Fiction',
    rating: 4,
    publishedYear: 2020,
    isbn: '111',
  },
  {
    bookId: '2',
    title: 'Beta',
    author: 'Author B',
    genre: 'Science Fiction',
    rating: 5,
    publishedYear: 2022,
    isbn: '222',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <Books />
    </MemoryRouter>
  );

describe('Books page', () => {
  it('renders loading state then books', async () => {
    (api.getBooks as any).mockResolvedValue(mockBooks);

    renderPage();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('book-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    (api.getBooks as any).mockRejectedValue(new Error('fail'));

    renderPage();

    await waitFor(() => {
      expect(errorUtils.handleApiError).toHaveBeenCalled();
    });
  });

  it('filters books via search', async () => {
    (api.getBooks as any).mockResolvedValue(mockBooks);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('book-grid')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Search'));

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  it('sorts books by rating', async () => {
    (api.getBooks as any).mockResolvedValue(mockBooks);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('book-grid')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByRole('combobox'), 'rating');

    const items = screen.getAllByText(/Alpha|Beta/);
    expect(items[0]).toHaveTextContent('Beta');
  });
});
