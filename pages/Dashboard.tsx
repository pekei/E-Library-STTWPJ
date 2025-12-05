import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Book, Users, Clock, AlertTriangle } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Stats, Category, Loan } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, activeMembers: 0, activeLoans: 0, overdueLoans: 0 });
  const [categoryData, setCategoryData] = useState<{name: string, value: number}[]>([]);
  const [criticalOverdues, setCriticalOverdues] = useState<{name: string, title: string, days: number}[]>([]);

  useEffect(() => {
    const books = StorageService.getBooks();
    const members = StorageService.getMembers();
    const loans = StorageService.getLoans();

    // Calculate generic stats
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue').length;
    
    // Simple Overdue Check (past due date)
    const now = new Date();
    const overdueLoansCount = loans.filter(l => {
        if(l.status === 'returned') return false;
        return new Date(l.dueDate) < now;
    }).length;

    setStats({
      totalBooks: books.reduce((acc, curr) => acc + curr.stock, 0),
      activeMembers: members.length,
      activeLoans,
      overdueLoans: overdueLoansCount
    });

    // Calculate Category Distribution
    const counts: Record<string, number> = {};
    Object.values(Category).forEach(c => counts[c] = 0);
    books.forEach(b => {
      if (counts[b.category] !== undefined) counts[b.category]++;
    });

    setCategoryData(Object.keys(counts).map(key => ({ name: key, value: counts[key] })).filter(d => d.value > 0));

    // Calculate Critical Overdues (> 3 days)
    const critical = loans.filter(l => {
        if (l.status === 'returned') return false;
        const dueDate = new Date(l.dueDate);
        const diffTime = now.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 3; // More than 3 days late
    }).map(l => {
        const book = books.find(b => b.id === l.bookId);
        const member = members.find(m => m.id === l.memberId);
        const dueDate = new Date(l.dueDate);
        const diffTime = now.getTime() - dueDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
            name: member?.name || 'Unknown',
            title: book?.title || 'Unknown',
            days: diffDays
        };
    });
    setCriticalOverdues(critical);

  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Ringkasan</h2>

      {/* Critical Overdue Alert */}
      {criticalOverdues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse">
            <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                    <h3 className="font-bold text-red-800">Peringatan Keterlambatan Kritis</h3>
                    <p className="text-sm text-red-700 mb-2">Terdapat {criticalOverdues.length} anggota dengan keterlambatan pengembalian lebih dari 3 hari:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                        {criticalOverdues.map((item, idx) => (
                            <li key={idx}>
                                <strong>{item.name}</strong> - {item.title} ({item.days} hari terlambat)
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Koleksi Buku</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.totalBooks}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Book className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Anggota Terdaftar</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.activeMembers}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Peminjaman Aktif</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.activeLoans}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Terlambat Kembali</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2 text-red-600">{stats.overdueLoans}</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribusi Kategori Buku</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistik Peminjaman</h3>
           <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
              <Clock className="w-8 h-8 mb-2 opacity-50" />
              <p>Data grafik historis akan tersedia setelah akumulasi data bulan berjalan.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;