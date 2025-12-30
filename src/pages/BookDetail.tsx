import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import {
  getBook,
  getReadingLists,
  updateReadingList,
  getReviewsApi,
  createReviewApi,
  deleteReviewApi,
} from '@/services/api';

import { Book, ReadingList, Review } from '@/types';
import { formatRating } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling';
import { useAuth } from '@/hooks/useAuth';
type MaybeNumber = number | string | undefined | null;

type BookApiShape = Partial<Book> & {
  id?: string;
  bookId?: string;
  rating?: MaybeNumber;
  averageRating?: MaybeNumber;
  year?: MaybeNumber;
  publishedYear?: MaybeNumber;
  publicationYear?: MaybeNumber;
  published_date?: MaybeNumber;
};

const toNumber = (v: MaybeNumber): number => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : 0;

  return Number.isFinite(n) ? n : 0;
};

const mapBookFromApi = (raw: BookApiShape): Book => {
  const bookId = String(raw.bookId ?? raw.id ?? '');
  const rating = toNumber(raw.rating ?? raw.averageRating);

  const publishedYear = toNumber(
    raw.publishedYear ?? raw.publicationYear ?? raw.year ?? raw.published_date
  );

  return {
    bookId,
    title: String(raw.title ?? ''),
    author: String(raw.author ?? ''),
    genre: String(raw.genre ?? ''),
    description: String(raw.description ?? ''),
    coverImage: String(raw.coverImage ?? ''),
    rating,
    publishedYear,
    isbn: String(raw.isbn ?? ''),
  };
};

/**

* BookDetail page component

*/

export function BookDetail() {
  // const { user } = useAuth();

  const { user, isAdmin } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [userLists, setUserLists] = useState<ReadingList[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  console.log('REVIEWS STATE:', reviews);

  useEffect(() => {
    if (id) {
      loadBook(id);

      loadReviews(id);
    }
  }, [id]);

  const loadBook = async (bookId: string) => {
    setIsLoading(true);

    try {
      const data = await getBook(bookId);

      if (Array.isArray(data)) {
        const foundRaw = (data as BookApiShape[]).find(
          (b) => String(b.bookId ?? b.id ?? '') === String(bookId)
        );

        setBook(foundRaw ? mapBookFromApi(foundRaw) : null);
      } else {
        setBook(data ? mapBookFromApi(data as BookApiShape) : null);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async (bookId: string) => {
    setIsReviewsLoading(true);

    try {
      const data = await getReviewsApi(bookId);

      setReviews(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleAddToList = async () => {
    if (!user) {
      alert('You must be logged in to manage reading lists.');

      navigate('/login');

      return;
    }

    setIsListModalOpen(true);

    try {
      const lists = await getReadingLists();

      setUserLists(lists);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSelectAndAddToList = async (list: ReadingList) => {
    if (!book) return;

    if (list.bookIds.includes(book.bookId)) {
      alert('This book is already in this list!');

      return;
    }

    setIsUpdating(true);

    try {
      const updatedBookIds = [...list.bookIds, book.bookId];

      await updateReadingList(list.id, { ...list, bookIds: updatedBookIds });
      showSuccess(`Added to ${list.name}!`);

      setIsListModalOpen(false);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const averageReviewRating =
    reviews.length > 0
      ? Number((reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1))
      : null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 hover:text-violet-600 mb-8 transition-colors group glass-effect px-4 py-2 rounded-xl border border-white/20 w-fit"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>

          <span className="font-semibold">Back</span>
        </button>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12">
            <div className="md:col-span-1">
              <div className="relative group">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full rounded-2xl shadow-2xl group-hover:shadow-glow transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
                {book.title}
              </h1>

              <p className="text-xl text-slate-600 mb-6 font-medium">by {book.author}</p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-xl border border-amber-200 shadow-sm">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <span className="text-lg font-bold text-amber-700">
                    {averageReviewRating !== null
                      ? formatRating(averageReviewRating)
                      : book.rating
                        ? formatRating(book.rating)
                        : '0.0'}
                  </span>
                </div>

                <span className="badge-gradient px-4 py-2 text-sm">{book.genre}</span>

                <div className="flex items-center text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  <span className="font-semibold">{book.publishedYear}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full mr-3"></span>
                  Description
                </h2>

                <p className="text-slate-700 leading-relaxed text-lg">{book.description}</p>
              </div>

              <div className="mb-8 glass-effect p-4 rounded-xl border border-white/20">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" onClick={handleAddToList}>
                  <svg
                    className="w-5 h-5 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add to Reading List
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      alert('You must be logged in to write a review.');

                      navigate('/login');

                      return;
                    }

                    setIsReviewModalOpen(true);
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2 inline"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Write a Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isListModalOpen}
          onClose={() => setIsListModalOpen(false)}
          title="Select a Reading List"
        >
          <div className="space-y-3">
            {userLists.length === 0 ? (
              <p className="text-center text-slate-500 py-4">
                No lists found. Please create one in Reading Lists page.
              </p>
            ) : (
              userLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => handleSelectAndAddToList(list)}
                  disabled={isUpdating}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:bg-violet-50 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-bold text-slate-900 group-hover:text-violet-700">
                      {list.name}
                    </p>

                    <p className="text-xs text-slate-500">{list.bookIds.length} books</p>
                  </div>

                  <svg
                    className="w-5 h-5 text-slate-400 group-hover:text-violet-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              ))
            )}

            <Button
              variant="secondary"
              className="w-full mt-4"
              onClick={() => navigate('/reading-lists')}
            >
              Go to Reading Lists
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Write a Review"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Rating (1-5)
              </label>

              <input
                type="number"
                min={1}
                max={5}
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Comment</label>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              disabled={isReviewSubmitting}
              onClick={async () => {
                if (!id) return;

                if (!user) return;

                const safeRating = Math.max(1, Math.min(5, Number(reviewRating)));

                setIsReviewSubmitting(true);

                try {
                  await createReviewApi({
                    bookId: id,

                    userId: user.id,

                    userName: user.name ?? 'User',

                    isAdmin,

                    rating: safeRating,

                    comment: reviewComment,
                  });

                  showSuccess('Review submitted!');

                  setIsReviewModalOpen(false);

                  setReviewRating(5);

                  setReviewComment('');

                  await loadReviews(id);
                } catch (error) {
                  handleApiError(error);
                } finally {
                  setIsReviewSubmitting(false);
                }
              }}
            >
              Submit Review
            </Button>
          </div>
        </Modal>

        <div className="mt-8 glass-effect rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-1 h-8 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full mr-3"></span>
            Reviews
          </h2>

          {isReviewsLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>

              <p className="text-slate-600 text-lg">
                No reviews yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 p-5 bg-white/60">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 font-medium text-base">
                        {r.userName?.trim() ? r.userName : 'User'}
                      </div>

                      {/* ❌ SİLİNDİ: backend yok */}
                      {/* {r.isAdmin && ( */}

                      {/* ✅ EKLENDİ: sadece Efnan Kadıoğlu */}
                      {r.userName?.trim() === 'Efnan Kadıoğlu' && (
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full
              bg-violet-100 text-violet-700 border border-violet-200"
                        >
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-900 font-semibold">
                      <span className="text-amber-500">⭐</span>

                      <span>{r.rating} / 5</span>
                    </div>
                  </div>

                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {r.comment?.trim() ? r.comment : '-'}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>

                    {user && r.userId === user.id ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (!id) return;

                          try {
                            await deleteReviewApi(r.bookId, r.createdAt);

                            showSuccess('Review deleted.');

                            await loadReviews(id);
                          } catch (error) {
                            handleApiError(error);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
