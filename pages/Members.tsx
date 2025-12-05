import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Member } from '../types';
import { Plus, Search, Trash2, Printer, X, CreditCard } from 'lucide-react';

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printMember, setPrintMember] = useState<Member | null>(null); // For Card Modal
  
  const [formData, setFormData] = useState<Partial<Member>>({
    name: '', id: '', email: '', phone: '', type: 'Mahasiswa', joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setMembers(StorageService.getMembers());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = formData as Member;
    
    // Strict Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newMember.email)) {
        alert("Format email tidak valid! Harap gunakan format email yang benar (contoh: nama@domain.com).");
        return;
    }

    // ID Normalization and Duplicate Check
    const normalizedId = newMember.id.trim();
    if (!normalizedId) {
        alert("ID Anggota tidak boleh kosong.");
        return;
    }

    // Case-insensitive duplicate check
    const isDuplicate = members.some(m => m.id.toLowerCase() === normalizedId.toLowerCase());
    if (isDuplicate) {
      alert(`ID Anggota "${normalizedId}" sudah terdaftar! Harap gunakan ID yang unik.`);
      return;
    }

    // Prepare data with clean ID
    const memberToSave = { ...newMember, id: normalizedId };
    
    const updated = [...members, memberToSave];
    StorageService.saveMembers(updated);
    setMembers(updated);
    setIsModalOpen(false);
    setFormData({ name: '', id: '', email: '', phone: '', type: 'Mahasiswa', joinDate: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus anggota ini?')) {
      const updated = members.filter(m => m.id !== id);
      StorageService.saveMembers(updated);
      setMembers(updated);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Data Anggota</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrasi Anggota
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari berdasarkan Nama atau NIM/NIDN..." 
          className="flex-1 outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">ID Anggota</th>
              <th className="p-4">Nama Lengkap</th>
              <th className="p-4">Tipe</th>
              <th className="p-4">Email</th>
              <th className="p-4">Bergabung</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMembers.map(member => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-medium">{member.id}</td>
                <td className="p-4 font-medium text-slate-900">{member.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${member.type === 'Dosen' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {member.type}
                  </span>
                </td>
                <td className="p-4">{member.email}</td>
                <td className="p-4">{member.joinDate}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setPrintMember(member)} className="text-slate-400 hover:text-brand-600" title="Cetak Kartu"><CreditCard className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(member.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Registrasi Anggota</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIM / NIDN (ID)</label>
                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2" 
                  value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Contoh: MHS2024001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Keanggotaan</label>
                <select className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Dosen">Dosen</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="w-full border border-slate-300 rounded-lg p-2" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No. HP</label>
                  <input required type="text" className="w-full border border-slate-300 rounded-lg p-2" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Daftar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Card Modal */}
      {printMember && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-lg">
             <div className="p-4 border-b flex justify-between items-center no-print">
                <h3 className="font-bold">Pratinjau Kartu Anggota</h3>
                <button onClick={() => setPrintMember(null)}><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-8 bg-slate-100 flex justify-center">
                {/* The Card Component */}
                <div id="member-card" className="w-[400px] h-[250px] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 relative print-only block">
                    {/* Header */}
                    <div className="bg-brand-700 h-20 p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-800 font-bold text-xl">
                            STT
                        </div>
                        <div className="text-white">
                            <h2 className="text-sm font-bold uppercase tracking-wider">Perpustakaan</h2>
                            <h1 className="text-xs opacity-90">STT Walter Post Jayapura</h1>
                        </div>
                    </div>
                    {/* Body */}
                    <div className="p-5 flex space-x-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-xs text-slate-400 uppercase">Nama Anggota</p>
                            <p className="font-bold text-slate-800 text-lg">{printMember.name}</p>
                            
                            <div className="flex justify-between mt-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">ID Anggota</p>
                                    <p className="font-mono text-brand-600 font-bold">{printMember.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Tipe</p>
                                    <p className="text-sm text-slate-700">{printMember.type}</p>
                                </div>
                            </div>
                        </div>
                         <div className="w-24 h-24 bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400 text-center">
                            Foto
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="absolute bottom-0 w-full bg-brand-50 h-8 flex items-center justify-center border-t border-brand-100">
                        <p className="text-[10px] text-brand-600">Kartu ini wajib dibawa saat peminjaman buku.</p>
                    </div>
                </div>
             </div>

             <div className="p-4 border-t bg-slate-50 flex justify-end space-x-3 no-print">
                <button onClick={() => setPrintMember(null)} className="px-4 py-2 text-slate-600">Tutup</button>
                <button onClick={handlePrintCard} className="px-4 py-2 bg-brand-600 text-white rounded-lg flex items-center">
                    <Printer className="w-4 h-4 mr-2" /> Cetak Kartu
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;