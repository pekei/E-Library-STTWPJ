import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Book, Member, Loan } from '../types';
import { Plus, CheckCircle, Clock, AlertTriangle, RotateCcw } from 'lucide-react';

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Loan Form
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setLoans(StorageService.getLoans());
    setBooks(StorageService.getBooks());
    setMembers(StorageService.getMembers());
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember) return;

    const book = books.find(b => b.id === selectedBook);
    if (!book || book.available < 1) {
      alert("Stok buku tidak tersedia!");
      return;
    }

    const newLoan: Loan = {
      id: `L-${Date.now()}`,
      bookId: selectedBook,
      memberId: selectedMember,
      loanDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
      status: 'active'
    };

    // Automatiskan Pengurangan Stok (Automatic Stock Reduction)
    const updatedBooks = books.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b);
    
    // Save
    StorageService.saveLoans([...loans, newLoan]);
    StorageService.saveBooks(updatedBooks);
    
    // Reset
    refreshData();
    setIsModalOpen(false);
    setSelectedBook('');
    setSelectedMember('');
  };

  const handleReturn = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    if(window.confirm("Konfirmasi pengembalian buku?")) {
        // Update Loan
        const updatedLoans = loans.map(l => 
            l.id === loanId ? { ...l, status: 'returned', returnDate: new Date().toISOString() } as Loan : l
        );

        // Automatiskan Penambahan Stok (Automatic Stock Restoration)
        const updatedBooks = books.map(b => 
            b.id === loan.bookId ? { ...b, available: b.available + 1 } : b
        );

        StorageService.saveLoans(updatedLoans);
        StorageService.saveBooks(updatedBooks);
        refreshData();
    }
  };

  const getBook = (id: string) => books.find(b => b.id === id);
  const getMember = (id: string) => members.find(m => m.id === id);

  const displayedLoans = loans.filter(l => 
    activeTab === 'active' ? (l.status === 'active' || l.status === 'overdue') : l.status === 'returned'
  ).sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Sirkulasi & Peminjaman</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Catat Peminjaman
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Sedang Dipinjam
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Riwayat Pengembalian
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">ID Transaksi</th>
              <th className="p-4">Anggota</th>
              <th className="p-4">Buku</th>
              <th className="p-4">Tanggal Pinjam</th>
              <th className="p-4">Jatuh Tempo</th>
              <th className="p-4">Status</th>
              {activeTab === 'active' && <th className="p-4 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedLoans.map(loan => (
              <tr key={loan.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-xs text-slate-500">{loan.id}</td>
                <td className="p-4">
                    <div className="font-medium text-slate-900">{getMember(loan.memberId)?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 font-mono">ID: {loan.memberId}</div>
                </td>
                <td className="p-4">
                    <div className="font-medium text-slate-900">{getBook(loan.bookId)?.title || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 font-mono">ISBN: {getBook(loan.bookId)?.isbn}</div>
                </td>
                <td className="p-4">{new Date(loan.loanDate).toLocaleDateString('id-ID')}</td>
                <td className="p-4">
                    {activeTab === 'history' && loan.returnDate ? (
                        <div className="text-slate-500">
                             Kembali: <span className="font-medium">{new Date(loan.returnDate).toLocaleDateString('id-ID')}</span>
                        </div>
                    ) : (
                        <span className="text-slate-800">{new Date(loan.dueDate).toLocaleDateString('id-ID')}</span>
                    )}
                </td>
                <td className="p-4">
                  {loan.status === 'returned' ? (
                    <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded w-fit text-xs font-bold border border-green-100"><CheckCircle className="w-3 h-3 mr-1"/> Selesai</span>
                  ) : new Date(loan.dueDate) < new Date() ? (
                    <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded w-fit text-xs font-bold border border-red-100"><AlertTriangle className="w-3 h-3 mr-1"/> Terlambat</span>
                  ) : (
                    <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit text-xs font-bold border border-blue-100"><Clock className="w-3 h-3 mr-1"/> Aktif</span>
                  )}
                </td>
                {activeTab === 'active' && (
                  <td className="p-4 text-right">
                    <button onClick={() => handleReturn(loan.id)} className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded hover:bg-green-100 border border-green-200 flex items-center ml-auto">
                      <RotateCcw className="w-3 h-3 mr-1" /> Kembalikan
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {displayedLoans.length === 0 && (
                <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">Tidak ada data transaksi.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold">Transaksi Peminjaman Baru</h3>
            </div>
            <form onSubmit={handleCreateLoan} className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Pilih Anggota</label>
                 <select required className="w-full border p-2 rounded-lg" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                    <option value="">-- Cari Anggota --</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Pilih Buku</label>
                 <select required className="w-full border p-2 rounded-lg" value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
                    <option value="">-- Cari Buku --</option>
                    {books.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title} (Sisa: {b.available})</option>)}
                 </select>
               </div>
               <div className="pt-4 flex justify-end space-x-2">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600">Batal</button>
                 <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg">Proses Peminjaman</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;