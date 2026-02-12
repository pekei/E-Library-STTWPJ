import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { CongregationMember, MemberStatus } from '../types';
import { Plus, Search, Trash2, Edit2, X, UserCheck, Phone, MapPin, Calendar } from 'lucide-react';

const Congregation: React.FC = () => {
  const [members, setMembers] = useState<CongregationMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<CongregationMember> = {
    id: '',
    name: '',
    gender: 'Laki-laki',
    birthDate: '',
    address: '',
    phone: '',
    status: MemberStatus.ACTIVE,
    joinDate: new Date().toISOString().split('T')[0],
    baptismDate: '',
    familyCardNumber: ''
  };

  const [formData, setFormData] = useState<Partial<CongregationMember>>(initialFormState);

  useEffect(() => {
    setMembers(StorageService.getMembers());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.id) {
        alert("Nama dan ID Anggota wajib diisi.");
        return;
    }

    if (editingId) {
        // Update existing
        const updated = members.map(m => m.id === editingId ? { ...m, ...formData } as CongregationMember : m);
        StorageService.saveMembers(updated);
        setMembers(updated);
    } else {
        // Create new
        const newMember = formData as CongregationMember;
        // Check duplicate ID
        if (members.some(m => m.id === newMember.id)) {
            alert(`ID Anggota "${newMember.id}" sudah terdaftar!`);
            return;
        }
        const updated = [...members, newMember];
        StorageService.saveMembers(updated);
        setMembers(updated);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleEdit = (member: CongregationMember) => {
      setFormData(member);
      setEditingId(member.id);
      setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data jemaat ini?')) {
      const updated = members.filter(m => m.id !== id);
      StorageService.saveMembers(updated);
      setMembers(updated);
    }
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Data Jemaat</h2>
            <p className="text-slate-500 text-sm">Kelola data anggota jemaat dan simpatisan.</p>
        </div>
        <button
          onClick={() => {
              setFormData(initialFormState);
              setEditingId(null);
              setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Jemaat
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama jemaat atau ID..."
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
                <th className="p-4">ID</th>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Jenis Kelamin</th>
                <th className="p-4">Status</th>
                <th className="p-4">Alamat & Kontak</th>
                <th className="p-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{member.id}</td>
                    <td className="p-4 font-medium text-slate-900">
                        <div>{member.name}</div>
                        <div className="text-xs text-slate-400 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Lahir: {member.birthDate}
                        </div>
                    </td>
                    <td className="p-4">{member.gender}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${member.status === MemberStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                              member.status === MemberStatus.SYMPATHIZER ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {member.status}
                        </span>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-xs">
                                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                                <span className="truncate max-w-[150px]" title={member.address}>{member.address}</span>
                            </div>
                            <div className="flex items-center text-xs">
                                <Phone className="w-3 h-3 mr-1 text-slate-400" />
                                {member.phone}
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                </tr>
                ))}
                {filteredMembers.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                            Tidak ada data jemaat yang ditemukan.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Data Jemaat' : 'Registrasi Jemaat Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
                <form id="congregationForm" onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Identitas Dasar */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-700 flex items-center"><UserCheck className="w-4 h-4 mr-2"/> Identitas</h4>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ID Jemaat <span className="text-red-500">*</span></label>
                                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Cth: J2024001" disabled={!!editingId} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.nik || ''} onChange={e => setFormData({...formData, nik: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                                    <select className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                                    <input required type="date" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                    value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Kontak & Status */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-700 flex items-center"><MapPin className="w-4 h-4 mr-2"/> Kontak & Status</h4>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                                <textarea className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon / WA</label>
                                <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status Keanggotaan</label>
                                <select className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as MemberStatus})}>
                                    {Object.values(MemberStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tgl Bergabung</label>
                                    <input type="date" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                    value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tgl Baptis</label>
                                    <input type="date" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                                    value={formData.baptismDate || ''} onChange={e => setFormData({...formData, baptismDate: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
                <button type="submit" form="congregationForm" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Simpan Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Congregation;