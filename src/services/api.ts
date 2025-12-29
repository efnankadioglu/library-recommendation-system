import { Book, ReadingList, Review } from '@/types';
import { fetchAuthSession } from 'aws-amplify/auth';


// Artık API_BASE_URL aktif (env’den geliyor)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  } catch (error) {
    console.error('Auth headers error:', error);
    return { 'Content-Type': 'application/json' };
  }
}

async function unwrapJson<T>(response: Response): Promise<T> {
  const result = await response.json();

  const payload = result?.body
    ? typeof result.body === 'string'
      ? JSON.parse(result.body)
      : result.body
    : result;

  return payload as T;
}

/* Get all books from the catalog */
export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`);

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
}

/* Get a single book by ID */
export async function getBook(id: string): Promise<Book | null> {
  const authHeaders = await getAuthHeaders(); // Token'ı alıyoruz

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'GET',
    headers: authHeaders
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');

  const result = await response.json();
  const bookData =
    typeof result.body === 'string' ? JSON.parse(result.body) : result.body || result;

  return bookData;
}

/* Create a new book (admin only) */
export async function createBook(book: Omit<Book, 'bookId'>): Promise<Book> {
  const authHeaders = await getAuthHeaders(); // Token'ı alıyoruz

  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: authHeaders, // Artık içinde Authorization var!
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Yeni kitap eklenirken bir hata oluştu. Lütfen AWS bağlantısını kontrol et!');
  }

  const result = await response.json();

  const newBook = result.body
    ? typeof result.body === 'string'
      ? JSON.parse(result.body)
      : result.body
    : result;

  console.log('Yeni kitap başarıyla eklendi:', newBook);
  return newBook as Book;
}

/* Update an existing book (admin only) */
export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  console.log('updateBook called', { id, book });

  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Kitap güncellenemedi (${response.status}). ${text}`);
  }

  const result = await response.json();

  const updatedBook = result.body
    ? typeof result.body === 'string'
      ? JSON.parse(result.body)
      : result.body
    : result;

  return updatedBook as Book;
}

/* Delete a book (admin only) */
export async function deleteBook(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders(); // Token'ı alıyoruz

  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
    headers: authHeaders, // Artık içinde Authorization var!
  });

  if (!response.ok) {
    throw new Error('Kitap silinirken AWS tarafında bir hata oluştu');
  }

  console.log(`${id} ID'li kitap AWS'den silindi.`);
}

/* Get AI-powered book recommendations using Amazon Bedrock */
export async function getRecommendations(favoriteGenres: string = 'Genel'): Promise<string> {
  try {
    const authHeaders = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favoriteGenres }),
    });

    if (!response.ok) {
      throw new Error(`AI Önerisi alınamadı: ${response.status}`);
    }

    const data = await unwrapJson<{ recommendations?: string }>(response);

    return typeof data.recommendations === 'string'
      ? data.recommendations
      : JSON.stringify(data.recommendations || data);
  } catch (error) {
    console.error('Bedrock API Hatası:', error);
    return 'Şu an öneri oluşturulamıyor, lütfen daha sonra tekrar deneyin.';
  }
}

/* Get user's reading lists */
export async function getReadingLists(): Promise<ReadingList[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists`, {
    method: 'GET',
    headers: authHeaders,
  });

  if (!response.ok) {
    throw new Error('Reading lists alınamadı');
  }

  const result = await response.json();

  return typeof result.body === 'string' ? JSON.parse(result.body) : (result.body ?? result);
}

/* Create a new reading list */
export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(list),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Reading list oluşturulamadı (${response.status}). ${text}`);
  }

  const result = await response.json();

  const created = typeof result.body === 'string' ? JSON.parse(result.body) : result.body || result;

  return created as ReadingList;
}

/* Update existing reading list */
export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(list),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Reading list güncellenemedi (${response.status}). ${text}`);
  }

  const result = await response.json();

  const updated = typeof result.body === 'string' ? JSON.parse(result.body) : result.body || result;

  return updated as ReadingList;
}

/* Delete a reading list */
export async function deleteReadingList(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reading-lists/${id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Reading list silinemedi (${response.status}). ${text}`);
  }
}

/* Get reviews for a book */
export async function getReviews(bookId: string): Promise<Review[]> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          bookId,
          userId: '1',
          rating: 5,
          comment: 'Absolutely loved this book! A must-read.',
          createdAt: '2024-11-01T10:00:00Z',
        },
      ];
      resolve(mockReviews);
    }, 500);
  });
}

/* Create a new review */
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      resolve(newReview);
    }, 500);
  });
}

// REAL REVIEWS API (AWS)

type ReviewApiItem = {
  bookId: string;
  createdAt: string;
  userId: string;
  userName?: string;
  rating: number;
  comment?: string;
};

const toReview = (item: ReviewApiItem): Review => ({
  id: `${item.bookId}#${item.createdAt}`,
  bookId: item.bookId,
  userId: item.userId,
  userName: item.userName ?? '',
  rating: item.rating,
  comment: item.comment ?? '',
  createdAt: item.createdAt,
});

type CreateReviewPayload = {
  bookId: string;
  userId: string;      
  userName?: string;  
  rating: number;
  comment?: string;
};


// GET /reviews?bookId=...
export async function getReviewsApi(bookId: string): Promise<Review[]> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reviews?bookId=${encodeURIComponent(bookId)}`, {
    method: 'GET',
    headers: authHeaders,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to fetch reviews (${response.status}). ${text}`);
  }

  const raw = (await response.json()) as ReviewApiItem[];
  return Array.isArray(raw) ? raw.map(toReview) : [];
}

// POST /reviews (JWT required)
export async function createReviewApi(payload: CreateReviewPayload): Promise<Review> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to create review (${response.status}). ${text}`);
  }

  const item = (await response.json()) as ReviewApiItem;
  return toReview(item);
}

// DELETE /reviews?bookId=...&createdAt=... (JWT required)
export async function deleteReviewApi(bookId: string, createdAt: string): Promise<void> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/reviews?bookId=${encodeURIComponent(bookId)}&createdAt=${encodeURIComponent(createdAt)}`,
    {
      method: 'DELETE',
      headers: authHeaders,
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to delete review (${response.status}). ${text}`);
  }
}

