import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { Sparkles, Send, Bot, User, Cross } from 'lucide-react';

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

    const response = await GeminiService.askAssistant(userText);
    
    setLoading(false);
    setHistory(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b bg-purple-50 flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">AI Church Assistant</h3>
            <p className="text-xs text-slate-500">Bantuan untuk khotbah, administrasi, dan konseling dasar.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 && (
            <div className="text-center text-slate-400 mt-20">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Cross className="w-8 h-8 text-purple-300 opacity-80" />
                </div>
                <h4 className="font-semibold text-slate-600">Syalom!</h4>
                <p className="max-w-md mx-auto text-sm mt-2">Saya asisten digital gereja Anda. Tanyakan tentang ide khotbah, manajemen jadwal, atau draf surat administrasi.</p>
            </div>
        )}
        {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    <div className="flex items-center space-x-2 mb-1 opacity-70 text-xs">
                        {msg.role === 'user' ? <User className="w-3 h-3"/> : <Bot className="w-3 h-3"/>}
                        <span>{msg.role === 'user' ? 'Anda' : 'AI Assistant'}</span>
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
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Tulis pertanyaan Anda..."
            value={query}
            onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
            <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;