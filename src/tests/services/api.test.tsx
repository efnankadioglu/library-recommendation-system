import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getRecommendations,
  getReadingLists,
  createReadingList,
  updateReadingList,
  deleteReadingList,
  getReviewsApi,
  createReviewApi,
  deleteReviewApi,
  getAdminReadingListsCount,
  getAdminUsersCount,
} from '@/services/api';

import { fetchAuthSession } from 'aws-amplify/auth';

/* -------------------------------------------------------------------------- */
/*                                   GLOBAL MOCKS                             */
/* -------------------------------------------------------------------------- */

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

vi.mock('aws-amplify/auth', () => ({
  fetchAuthSession: vi.fn(),
}));

const mockAuthSession = fetchAuthSession as any;

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const okResponse = (data: unknown) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);

const errorResponse = (status = 500, text = 'Error') =>
  Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(text),
  } as Response);

beforeEach(() => {
  vi.clearAllMocks();

  mockAuthSession.mockResolvedValue({
    tokens: {
      idToken: {
        toString: () => 'mock-token',
      },
    },
  });
});

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe('API Service', () => {
  /* -------------------------------- BOOKS -------------------------------- */

  it('getBooks returns books list', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse([{ bookId: '1', title: 'Book' }])
    );

    const books = await getBooks();

    expect(books).toHaveLength(1);

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('/books');
  });

  it('getBook returns null when status is 404', async () => {
    mockFetch.mockImplementationOnce(
      () => Promise.resolve({ status: 404 } as Response)
    );

    const book = await getBook('1');
    expect(book).toBeNull();
  });

  it('createBook sends POST with auth header', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ body: { bookId: '1', title: 'New Book' } })
    );

    const book = await createBook({ title: 'New Book' } as any);

    expect(book.bookId).toBe('1');

    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toContain('/books');
    expect(options.method).toBe('POST');
    expect(options.headers).toMatchObject({
      Authorization: 'Bearer mock-token',
    });
  });

  it('updateBook throws error when response is not ok', async () => {
    mockFetch.mockImplementationOnce(() =>
      errorResponse(400, 'Bad Request')
    );

    await expect(updateBook('1', { title: 'X' })).rejects.toThrow(
      /Kitap güncellenemedi/
    );
  });

  it('deleteBook sends DELETE request', async () => {
    mockFetch.mockImplementationOnce(() => okResponse({}));

    await deleteBook('1');

    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toContain('/books/1');
    expect(options.method).toBe('DELETE');
  });

  /* --------------------------- RECOMMENDATIONS ---------------------------- */

  it('getRecommendations returns recommendation string', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ body: { recommendations: 'AI Suggestion' } })
    );

    const result = await getRecommendations('Sci-Fi');
    expect(result).toContain('AI');
  });

  it('getRecommendations returns fallback text on error', async () => {
    mockFetch.mockImplementationOnce(() => errorResponse(500));

    const result = await getRecommendations();
    expect(result).toContain('öneri');
  });

  /* ---------------------------- READING LISTS ----------------------------- */

  it('getReadingLists returns lists', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ body: [{ id: '1', name: 'List' }] })
    );

    const lists = await getReadingLists();
    expect(lists[0].id).toBe('1');
  });

  it('createReadingList returns created list', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ body: { id: '1', name: 'My List' } })
    );

    const list = await createReadingList({ name: 'My List' } as any);
    expect(list.name).toBe('My List');
  });

  it('updateReadingList throws error when not ok', async () => {
    mockFetch.mockImplementationOnce(() => errorResponse(400));

    await expect(updateReadingList('1', {})).rejects.toThrow(
      /Reading list güncellenemedi/
    );
  });

  it('deleteReadingList deletes successfully', async () => {
    mockFetch.mockImplementationOnce(() => okResponse({}));

    await deleteReadingList('1');
    expect(mockFetch).toHaveBeenCalled();
  });

  /* -------------------------------- REVIEWS ------------------------------- */

  it('getReviewsApi maps API response', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse([
        {
          bookId: '1',
          createdAt: '2024',
          userId: 'u1',
          rating: 5,
        },
      ])
    );

    const reviews = await getReviewsApi('1');
    expect(reviews[0].id).toContain('1#');
  });

  it('createReviewApi creates review', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({
        bookId: '1',
        createdAt: '2024',
        userId: 'u1',
        rating: 4,
      })
    );

    const review = await createReviewApi({
      bookId: '1',
      userId: 'u1',
      rating: 4,
    });

    expect(review.rating).toBe(4);
  });

  it('deleteReviewApi deletes review', async () => {
    mockFetch.mockImplementationOnce(() => okResponse({}));

    await deleteReviewApi('1', '2024');
    expect(mockFetch).toHaveBeenCalled();
  });

  /* -------------------------------- ADMIN -------------------------------- */

  it('getAdminReadingListsCount returns count', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ totalLists: 5 })
    );

    const count = await getAdminReadingListsCount();
    expect(count).toBe(5);
  });

  it('getAdminUsersCount throws if response invalid', async () => {
    mockFetch.mockImplementationOnce(() =>
      okResponse({ foo: 'bar' })
    );

    await expect(getAdminUsersCount()).rejects.toThrow(
      /Users count response is invalid/
    );
  });
});
