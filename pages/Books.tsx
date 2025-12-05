import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Book, Category } from '../types';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '', author: '', isbn: '', publisher: '', year: new Date().getFullYear(), stock: 1, category: Category.THEOLOGY
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setBooks(StorageService.getBooks());
  };

  const handleOpenModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '', author: '', isbn: '', publisher: '', year: new Date().getFullYear(), stock: 1, category: Category.THEOLOGY, available: 1
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus buku ini dari koleksi?')) {
      const updated = books.filter(b => b.id !== id);
      StorageService.saveBooks(updated);
      setBooks(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      // Edit
      const updatedBooks = books.map(b => 
        b.id === editingBook.id ? { ...b, ...formData, available: formData.available || 0 } as Book : b
      );
      StorageService.saveBooks(updatedBooks);
    } else {
      // Add
      const newBook: Book = {
        ...formData as Book,
        id: Date.now().toString(),
        available: formData.stock || 1 // New books are fully available
      };
      StorageService.saveBooks([...books, newBook]);
    }
    loadBooks();
    setIsModalOpen(false);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Manajemen Koleksi Buku</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Buku
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan Judul, Penulis, ISBN, atau Kategori..." 
          className="flex-1 outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">ISBN</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Penulis</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 text-center">Stok</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBooks.map(book => (
              <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs">{book.isbn}</td>
                <td className="p-4 font-medium text-slate-900">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{book.category}</span></td>
                <td className="p-4 text-center">
                  <span className={book.available > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                    {book.available}
                  </span>
                  <span className="text-slate-400"> / {book.stock}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal(book)} className="text-slate-400 hover:text-brand-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(book.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingBook ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Buku</label>
                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Penulis</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Penerbit</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
                  <input required type="number" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Stok</label>
                  <input required type="number" min="1" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 outline-none" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Simpan Buku</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;