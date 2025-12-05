import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  askLibrarian: async (query: string): Promise<string> => {
    if (!ai) return "API Key konfigurasi belum dipasang. Harap hubungi administrator.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: "Anda adalah asisten pustakawan profesional di Sekolah Tinggi Teologi (STT) Walter Post Jayapura. Jawablah pertanyaan terkait rekomendasi buku teologi, ringkasan topik alkitabiah, atau bantuan administrasi perpustakaan dengan sopan, akademis, dan membantu.",
        }
      });
      return response.text || "Maaf, saya tidak dapat memproses permintaan saat ini.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Terjadi kesalahan saat menghubungkan ke AI Librarian.";
    }
  }
};