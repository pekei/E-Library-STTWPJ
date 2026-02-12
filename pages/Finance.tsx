import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { FinanceRecord, FinanceType, FinanceCategory } from '../types';
import { Plus, Search, Trash2, Edit2, X, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

const Finance: React.FC = () => {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<FinanceRecord> = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    type: FinanceType.INCOME,
    category: FinanceCategory.OFFERING_WEEKLY,
    amount: 0,
    description: '',
    recordedBy: 'Admin'
  };

  const [formData, setFormData] = useState<Partial<FinanceRecord>>(initialFormState);

  useEffect(() => {
    setRecords(StorageService.getFinanceRecords());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.date) {
        alert("Jumlah dan Tanggal wajib diisi.");
        return;
    }

    if (editingId) {
        const updated = records.map(r => r.id === editingId ? { ...r, ...formData } as FinanceRecord : r);
        StorageService.saveFinanceRecords(updated);
        setRecords(updated);
    } else {
        const newRecord = { ...formData, id: `F${Date.now()}` } as FinanceRecord;
        const updated = [newRecord, ...records];
        StorageService.saveFinanceRecords(updated);
        setRecords(updated);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus transaksi ini?')) {
      const updated = records.filter(r => r.id !== id);
      StorageService.saveFinanceRecords(updated);
      setRecords(updated);
    }
  };

  const handleEdit = (record: FinanceRecord) => {
      setFormData(record);
      setEditingId(record.id);
      setIsModalOpen(true);
  };

  const filteredRecords = records.filter(r =>
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate Stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthRecords = records.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = thisMonthRecords.filter(r => r.type === FinanceType.INCOME).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const expense = thisMonthRecords.filter(r => r.type === FinanceType.EXPENSE).reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = income - expense;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Keuangan Gereja</h2>
            <p className="text-slate-500 text-sm">Rekapitulasi pemasukan dan pengeluaran bulan ini.</p>
        </div>
        <button
          onClick={() => {
              setFormData(initialFormState);
              setEditingId(null);
              setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Catat Transaksi
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500">Pemasukan Bulan Ini</p>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatIDR(income)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100 flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500">Pengeluaran Bulan Ini</p>
                  <h3 className="text-2xl font-bold text-rose-600 mt-1">{formatIDR(expense)}</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-full text-rose-600">
                  <TrendingDown className="w-6 h-6" />
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-slate-500">Saldo Bulan Ini</p>
                  <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatIDR(balance)}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <DollarSign className="w-6 h-6" />
              </div>
          </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          className="flex-1 outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Keterangan</th>
                <th className="p-4 text-right">Nominal</th>
                <th className="p-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {record.date}
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${record.type === FinanceType.INCOME ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {record.category}
                        </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{record.description}</td>
                    <td className={`p-4 text-right font-bold font-mono ${record.type === FinanceType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {record.type === FinanceType.INCOME ? '+' : '-'} {formatIDR(record.amount)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(record)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                </tr>
                ))}
                 {filteredRecords.length === 0 && (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                            Tidak ada data transaksi.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Transaksi' : 'Catat Transaksi Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Transaksi</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button"
                            onClick={() => setFormData({...formData, type: FinanceType.INCOME})}
                            className={`py-2 rounded-lg border flex items-center justify-center ${formData.type === FinanceType.INCOME ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold' : 'border-slate-200 text-slate-500'}`}>
                            Pemasukan
                        </button>
                        <button type="button"
                            onClick={() => setFormData({...formData, type: FinanceType.EXPENSE})}
                            className={`py-2 rounded-lg border flex items-center justify-center ${formData.type === FinanceType.EXPENSE ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' : 'border-slate-200 text-slate-500'}`}>
                            Pengeluaran
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as FinanceCategory})}>
                        {Object.values(FinanceCategory).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                    <input required type="date" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                    value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
                    <input required type="number" min="0" className="w-full border border-slate-300 rounded-lg p-2 outline-none font-mono text-lg"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} placeholder="0" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                    <textarea className="w-full border border-slate-300 rounded-lg p-2 outline-none h-20 resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Contoh: Persembahan Minggu ke-1" />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm">Simpan</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;