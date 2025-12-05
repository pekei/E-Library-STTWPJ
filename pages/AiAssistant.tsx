import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Send, Bot, User } from 'lucide-react';

const AiAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const response = await GeminiService.askLibrarian(userText);
    
    setLoading(false);
    setHistory(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b bg-brand-50 flex items-center space-x-3">
        <div className="p-2 bg-brand-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-brand-600" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">AI Librarian Assistant</h3>
            <p className="text-xs text-slate-500">Tanyakan tentang rekomendasi buku teologi atau ringkasan materi.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Halo! Saya asisten perpustakaan Anda. Ada yang bisa saya bantu?</p>
            </div>
        )}
        {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    <div className="flex items-center space-x-2 mb-1 opacity-70 text-xs">
                        {msg.role === 'user' ? <User className="w-3 h-3"/> : <Bot className="w-3 h-3"/>}
                        <span>{msg.role === 'user' ? 'Anda' : 'AI Librarian'}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <div className="bg-slate-100 p-3 rounded-lg rounded-bl-none">
                    <span className="animate-pulse text-sm text-slate-500">Sedang mengetik...</span>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleAsk} className="p-4 border-t bg-slate-50 flex space-x-2">
        <input 
            type="text" 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="Ketik pertanyaan Anda di sini..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
            <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;