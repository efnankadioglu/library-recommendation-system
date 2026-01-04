// src/tests/pages/Admin.test.tsx

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Admin } from '@/pages/Admin';
import * as api from '@/services/api';
import * as errorUtils from '@/utils/errorHandling';

vi.mock('@/services/api', () => ({
  getBooks: vi.fn(),
  createBook: vi.fn(),
  deleteBook: vi.fn(),
  updateBook: vi.fn(),
  getAdminUsersCount: vi.fn(),
  getAdminReadingListsCount: vi.fn(),
}));

vi.mock('@/utils/errorHandling', () => ({
  handleApiError: vi.fn(),
  showSuccess: vi.fn(),
}));

const mockBooks = [
  {
    bookId: '1',
    title: 'Book 1',
    author: 'Author 1',
    genre: 'Genre 1',
    rating: 4,
    description: '',
    coverImage: '',
    publishedYear: 2020,
    isbn: '111',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(window, 'confirm').mockReturnValue(true);

  (api.getBooks as any).mockResolvedValue(mockBooks);
  (api.getAdminUsersCount as any).mockResolvedValue(10);
  (api.getAdminReadingListsCount as any).mockResolvedValue(5);
});

describe('Admin page', () => {
  it('renders loading then dashboard', async () => {
    render(<Admin />);
    await screen.findByText('Admin Dashboard');
  });

  it('loads metrics and books', async () => {
    render(<Admin />);
    await screen.findByText('Book 1');
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('opens and closes add book modal', async () => {
    render(<Admin />);
    await screen.findByText('Admin Dashboard');

    await userEvent.click(screen.getByRole('button', { name: 'Add New Book' }));

    const modalTitle = await screen.findAllByText('Add New Book');
    const modal = modalTitle[1].closest('[class*="fixed"]') as HTMLElement;

    await userEvent.click(within(modal).getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Add Book')).not.toBeInTheDocument();
    });
  });

  it('creates a new book successfully', async () => {
    (api.createBook as any).mockResolvedValue({
      ...mockBooks[0],
      bookId: '2',
      title: 'New Book',
    });

    render(<Admin />);
    await screen.findByText('Admin Dashboard');

    await userEvent.click(screen.getByRole('button', { name: 'Add New Book' }));

    const modalTitle = await screen.findAllByText('Add New Book');
    const modal = modalTitle[1].closest('[class*="fixed"]') as HTMLElement;

    const inputs = within(modal).getAllByRole('textbox');
    await userEvent.type(inputs[0], 'New Book');
    await userEvent.type(inputs[1], 'New Author');

    await userEvent.click(within(modal).getByRole('button', { name: 'Add Book' }));

    await waitFor(() => {
      expect(api.createBook).toHaveBeenCalled();
      expect(errorUtils.showSuccess).toHaveBeenCalled();
    });
  });

  it('handles create book validation error', async () => {
    render(<Admin />);
    await screen.findByText('Admin Dashboard');

    await userEvent.click(screen.getByRole('button', { name: 'Add New Book' }));

    const modalTitle = await screen.findAllByText('Add New Book');
    const modal = modalTitle[1].closest('[class*="fixed"]') as HTMLElement;

    await userEvent.click(within(modal).getByRole('button', { name: 'Add Book' }));

    expect(window.alert).toHaveBeenCalled();
  });

  it('deletes a book', async () => {
    (api.deleteBook as any).mockResolvedValue(undefined);

    render(<Admin />);
    await screen.findByText('Book 1');

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(api.deleteBook).toHaveBeenCalledWith('1');
      expect(errorUtils.showSuccess).toHaveBeenCalled();
    });
  });

  it('opens edit modal and updates book', async () => {
    (api.updateBook as any).mockResolvedValue({ title: 'Updated Book' });

    render(<Admin />);
    await screen.findByText('Book 1');

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const modalTitle = await screen.findByText('Edit Book');
    const modal = modalTitle.closest('[class*="fixed"]') as HTMLElement;

    const inputs = within(modal).getAllByRole('textbox');
    await userEvent.clear(inputs[0]);
    await userEvent.type(inputs[0], 'Updated Book');

    await userEvent.click(within(modal).getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(api.updateBook).toHaveBeenCalled();
      expect(errorUtils.showSuccess).toHaveBeenCalled();
    });
  });

  it('handles update book error', async () => {
    (api.updateBook as any).mockRejectedValue(new Error('fail'));

    render(<Admin />);
    await screen.findByText('Book 1');

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    const modalTitle = await screen.findByText('Edit Book');
    const modal = modalTitle.closest('[class*="fixed"]') as HTMLElement;

    await userEvent.click(within(modal).getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(errorUtils.handleApiError).toHaveBeenCalled();
    });
  });
});
