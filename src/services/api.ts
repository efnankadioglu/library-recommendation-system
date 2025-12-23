import { Book, ReadingList, Review } from '@/types';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for MOST API calls.
 *
 * In Week 2 we are starting to connect the frontend to the REAL AWS backend.
 * For now, ONLY getBooks() is connected to your API Gateway endpoint.
 *
 * TO IMPLEMENT FULL AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [x] Week 1: Set up AWS account and first Lambda function
 * [x] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [x] Week 2: Deploy Lambda function for Books API
 * [x] Week 2: Deploy API Gateway endpoint: GET /books
 * [x] Week 2: Set VITE_API_BASE_URL in .env file
 * [x] Week 3: Set up Cognito User Pool
 * [x] Week 3: Install aws-amplify: npm install aws-amplify
 * [x] Week 3: Configure Amplify in src/main.tsx
 * [x] Week 3: Update AuthContext with Cognito functions
 * [x] Week 3: Implement getAuthHeaders() function below
 * [x] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// Artık API_BASE_URL aktif (env’den geliyor)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * TODO (Week 3): Implement this function
 *
 * This function gets the JWT token from Cognito and adds it to API requests.
 *
 * Implementation:
 * 1. Import: import { fetchAuthSession } from 'aws-amplify/auth';
 * 2. Get session: const session = await fetchAuthSession();
 * 3. Extract token: const token = session.tokens?.idToken?.toString();
 * 4. Return headers with Authorization: Bearer {token}
 *
 * See IMPLEMENTATION_GUIDE.md - Week 3, Day 5-7 for complete code.
 */

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    console.log("AWS'ye gönderilen (ID) Token:", token);

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

/**
 * Get all books from the catalog
 *
 * ✅ Week 2: This is now connected to your REAL AWS backend.
 *
 * Implementation:
 * - Lambda: library-get-books
 * - API Gateway: GET /books
 * - Base URL: VITE_API_BASE_URL (set in .env)
 *
 * Expected response: Array of Book objects from DynamoDB
 */
export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`);

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
}

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 */
// export async function getBook(id: string): Promise<Book | null> {
//   const response = await fetch(`${API_BASE_URL}/books/${id}`);

//   if (response.status === 404) return null;

//   if (!response.ok) {
//     throw new Error('Failed to fetch book');
//   }

//   return response.json();
// }

export async function getBook(id: string): Promise<Book | null> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');

  const result = await response.json();
  const bookData =
    typeof result.body === 'string' ? JSON.parse(result.body) : result.body || result;

  return bookData;
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
// export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
//   // Şimdilik MOCK
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const newBook: Book = {
//         ...book,
//         bookId: Date.now().toString(),
//       };
//       resolve(newBook);
//     }, 500);
//   });
// }

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

/**
 * Update an existing book (admin only)
 * ✅ Week 3: Now connected to AWS with PUT method and JWT Auth
 */
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

/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */
// export async function deleteBook(): Promise<void> {
//   // Şimdilik MOCK
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(), 300);
//   });
// }
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

/**
 * Get AI-powered book recommendations using Amazon Bedrock
 * Week 4: Connected to REAL AWS Bedrock API
 */
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

/**
 * Get user's reading lists
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
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

/**
 * Create a new reading list
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
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

/**
 * Delete a reading list
 * TODO: Replace with DELETE /reading-lists/:id API call
 */
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

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */
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

/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
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
