import React from 'react';
import { StorageService } from '../services/storageService';
import { Download } from 'lucide-react';

const Reports: React.FC = () => {
  const books = StorageService.getBooks();
  const members = StorageService.getMembers();
  const loans = StorageService.getLoans();

  const handleExportCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Pusat Laporan</h2>
      <p className="text-slate-600">Unduh data perpustakaan untuk keperluan audit dan pelaporan Sekolah Tinggi Teologi.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Books Report */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Laporan Koleksi Buku</h3>
            <p className="text-sm text-slate-500 mb-4">{books.length} judul buku terdaftar.</p>
            <button 
                onClick={() => handleExportCSV(books, 'laporan_buku_stt')}
                className="w-full py-2 border border-brand-200 text-brand-700 rounded-lg hover:bg-brand-50 flex justify-center items-center"
            >
                <Download className="w-4 h-4 mr-2" /> Unduh CSV
            </button>
        </div>

        {/* Members Report */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Laporan Anggota</h3>
            <p className="text-sm text-slate-500 mb-4">{members.length} anggota aktif.</p>
             <button 
                onClick={() => handleExportCSV(members, 'laporan_anggota_stt')}
                className="w-full py-2 border border-brand-200 text-brand-700 rounded-lg hover:bg-brand-50 flex justify-center items-center"
            >
                <Download className="w-4 h-4 mr-2" /> Unduh CSV
            </button>
        </div>

        {/* Loans Report */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Laporan Transaksi</h3>
            <p className="text-sm text-slate-500 mb-4">{loans.length} total riwayat peminjaman.</p>
             <button 
                onClick={() => handleExportCSV(loans, 'laporan_transaksi_stt')}
                className="w-full py-2 border border-brand-200 text-brand-700 rounded-lg hover:bg-brand-50 flex justify-center items-center"
            >
                <Download className="w-4 h-4 mr-2" /> Unduh CSV
            </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;