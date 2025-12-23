import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getReadingLists, createReadingList, deleteReadingList, updateReadingList, getBooks } from '@/services/api';
import { ReadingList, Book } from '@/types';
import { formatDate } from '@/utils/formatters';
import { handleApiError, showSuccess } from '@/utils/errorHandling'; 

export function ReadingLists() {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  useEffect(() => {
    loadLists();
    loadAllBooks();
  }, []);

  const loadLists = async () => {
    setIsLoading(true);
    try {
      const data = await getReadingLists();
      setLists(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllBooks = async () => {
    try {
      const booksData = await getBooks();
      setAllBooks(booksData);
    } catch (error) {
      console.error('Books could not be loaded', error);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      alert('Please enter a list name');
      return;
    }


    try {
      const newList = await createReadingList({
         userId: '1', // TODO: Get from auth context
        name: newListName,
        description: newListDescription,
        bookIds: [],
      });
      setLists([...lists, newList]);
      setIsModalOpen(false);
      setNewListName('');
      setNewListDescription('');
      showSuccess('Reading list created successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddBookToList = async (list: ReadingList, bId: string) => {
    const listId = list.id;
    if (!listId || listId === 'undefined') return;

    if (list.bookIds.includes(bId)) {
      alert('This book is already in the list');
      return;
    }

    try {
      const updatedBookIds = [...list.bookIds, bId];
      await updateReadingList(listId, { ...list, bookIds: updatedBookIds });
      setLists(lists.map(l => l.id === listId ? { ...l, bookIds: updatedBookIds } : l));
      showSuccess('Book added to list');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemoveBook = async (list: ReadingList, bId: string) => {
    try {
      const updatedBookIds = list.bookIds.filter(id => id !== bId);
      await updateReadingList(list.id, { ...list, bookIds: updatedBookIds });
      setLists(lists.map(l => l.id === list.id ? { ...l, bookIds: updatedBookIds } : l));
      showSuccess('Book removed from list');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteList = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      await deleteReadingList(id);
      setLists(prev => prev.filter(l => l.id !== id));
      showSuccess('List deleted');
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50/50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 font-display">My Reading Lists</h1>
            <p className="text-slate-600 text-lg">Organize your book collections in style</p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200"
          >
            Create New List
          </Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No reading lists yet</h3>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>Create Your First List</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lists.map((list) => (
              <div
                key={list.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[420px] hover:shadow-xl hover:border-violet-400 transition-all duration-300 relative group"
              >
                <button 
                  onClick={() => handleDeleteList(list.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 font-bold text-2xl transition-colors"
                >
                  ×
                </button>

                <div className="flex-1 overflow-hidden">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 truncate pr-6">{list.name}</h3>
                  <p className="text-slate-500 mb-4 line-clamp-2 text-sm italic h-10">{list.description || 'No description provided.'}</p>
                  
                  <div className="mb-4">
                    <select 
                      className="w-full p-2.5 border border-violet-100 rounded-xl text-sm bg-violet-50/30 text-violet-800 focus:ring-2 focus:ring-violet-400 outline-none transition-all cursor-pointer font-medium"
                      onChange={(e) => e.target.value && handleAddBookToList(list, e.target.value)}
                      value=""
                    >
                      <option value="">+ Add to collection</option>
                      {allBooks.map(book => (
                        <option key={book.bookId} value={book.bookId}>{book.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hata Çözümü: min-h-[32px] yerine min-h-8 kullanıldı */}
                  <div className="flex flex-wrap gap-2 overflow-y-auto max-h-36 pr-1 custom-scrollbar min-h-8">
                    {list.bookIds && list.bookIds.map((bId) => {
                      const book = allBooks.find(b => b.bookId === bId);
                      return (
                        <div key={bId} className="flex items-center gap-1 bg-violet-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm">
                          <span className="max-w-[110px] truncate">{book?.title || 'Book'}</span>
                          <button onClick={() => handleRemoveBook(list, bId)} className="ml-1 hover:text-red-200 transition-colors">×</button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold text-violet-400 border-t border-slate-50 pt-4 mt-auto uppercase tracking-widest">
                  <span>{list.bookIds.length} Books Collected</span>
                  <span className="text-slate-400">{formatDate(list.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Reading List">
          <div className="space-y-4 py-2">
            <Input label="List Name" type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="Summer 2024 Collection" required className="focus:ring-violet-500" />
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
              <textarea 
                value={newListDescription} 
                onChange={(e) => setNewListDescription(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none min-h-[120px] resize-none text-sm bg-slate-50/30" 
                placeholder="Describe your collection..."
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="primary" onClick={handleCreateList} className="flex-1 bg-violet-600">Create List</Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}