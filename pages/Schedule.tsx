import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Event, EventType } from '../types';
import { Plus, Search, Trash2, Edit2, X, Calendar, Clock, MapPin } from 'lucide-react';

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<Event> = {
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: 'Gedung Gereja',
    description: '',
    type: EventType.SERVICE
  };

  const [formData, setFormData] = useState<Partial<Event>>(initialFormState);

  useEffect(() => {
    setEvents(StorageService.getEvents());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
        alert("Judul dan Tanggal wajib diisi.");
        return;
    }

    if (editingId) {
        const updated = events.map(ev => ev.id === editingId ? { ...ev, ...formData } as Event : ev);
        StorageService.saveEvents(updated);
        setEvents(updated);
    } else {
        const newEvent = { ...formData, id: `E${Date.now()}` } as Event;
        const updated = [...events, newEvent];
        StorageService.saveEvents(updated);
        setEvents(updated);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus kegiatan ini?')) {
      const updated = events.filter(ev => ev.id !== id);
      StorageService.saveEvents(updated);
      setEvents(updated);
    }
  };

  const handleEdit = (event: Event) => {
      setFormData(event);
      setEditingId(event.id);
      setIsModalOpen(true);
  };

  const filteredEvents = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Jadwal & Kegiatan</h2>
            <p className="text-slate-500 text-sm">Kalender kegiatan dan ibadah gereja.</p>
        </div>
        <button
          onClick={() => {
              setFormData(initialFormState);
              setEditingId(null);
              setIsModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Kegiatan
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-2">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kegiatan..."
          className="flex-1 outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          event.type === EventType.SERVICE ? 'bg-blue-100 text-blue-700' :
                          event.type === EventType.YOUTH ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                      }`}>
                          {event.type}
                      </span>
                      <div className="flex space-x-1">
                          <button onClick={() => handleEdit(event)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(event.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                          {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {event.time} WIT
                      </div>
                      <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                          {event.location}
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {filteredEvents.length === 0 && (
          <div className="text-center py-10 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada jadwal kegiatan.</p>
          </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-red-500" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kegiatan</label>
                    <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Contoh: Ibadah Minggu Raya" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                        <select className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                        value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as EventType})}>
                            {Object.values(EventType).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                        <input required type="date" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                        value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
                        <input required type="time" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                        <input required type="text" className="w-full border border-slate-300 rounded-lg p-2 outline-none"
                        value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                    <textarea className="w-full border border-slate-300 rounded-lg p-2 outline-none h-24 resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Deskripsi singkat kegiatan..." />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                    <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-sm">Simpan</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;