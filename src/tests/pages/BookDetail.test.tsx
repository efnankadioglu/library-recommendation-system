// src/tests/pages/BookDetail.test.tsx
// SADECE DOSYA – AÇIKLAMA YOK

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BookDetail } from '@/pages/BookDetail';

import * as api from '@/services/api';
import * as authHook from '@/hooks/useAuth';
import * as errorUtils from '@/utils/errorHandling';

vi.mock('@/services/api', () => ({
  getBook: vi.fn(),
  getReadingLists: vi.fn(),
  updateReadingList: vi.fn(),
  getReviewsApi: vi.fn(),
  createReviewApi: vi.fn(),
  deleteReviewApi: vi.fn(),
}));

vi.mock('@/utils/errorHandling', () => ({
  handleApiError: vi.fn(),
  showSuccess: vi.fn(),
}));

const mockUser = {
  id: 'u1',
  name: 'Test User',
  email: 'test@test.com',
};

const mockBook = {
  bookId: '1',
  title: 'Test Book',
  author: 'Author',
  genre: 'Fiction',
  description: 'Desc',
  coverImage: '',
  rating: 4,
  publishedYear: 2020,
  isbn: '123',
};

const mockReviews = [
  {
    id: 'r1',
    bookId: '1',
    userId: 'u1',
    userName: 'Test User',
    rating: 4,
    comment: 'Nice',
    createdAt: new Date().toISOString(),
  },
];

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(authHook, 'useAuth').mockReturnValue({
    user: mockUser,
    isAdmin: false,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
    confirmSignup: vi.fn(),
  } as any);

  (api.getBook as any).mockResolvedValue(mockBook);
  (api.getReviewsApi as any).mockResolvedValue(mockReviews);
  (api.getReadingLists as any).mockResolvedValue([
    { id: 'l1', name: 'List 1', bookIds: [] },
  ]);
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/books/1']}>
      <Routes>
        <Route path="/books/:id" element={<BookDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('BookDetail page', () => {
  it('handles review submit error', async () => {
    (api.createReviewApi as any).mockRejectedValue(new Error('fail'));

    renderPage();

    await userEvent.click(
      await screen.findByRole('button', { name: /write a review/i })
    );

    const modalTitle = await screen.findByRole('heading', {
      name: /write a review/i,
    });

    const modal = modalTitle.closest('[class*="relative"]') as HTMLElement;

    await userEvent.click(within(modal).getByText('Submit Review'));

    await waitFor(() => {
      expect(errorUtils.handleApiError).toHaveBeenCalled();
    });
  });
});
