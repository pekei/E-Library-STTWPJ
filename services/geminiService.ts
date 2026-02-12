import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  askAssistant: async (query: string): Promise<string> => {
    if (!ai) return "API Key konfigurasi belum dipasang. Harap hubungi administrator.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: query,
        config: {
          systemInstruction: "Anda adalah asisten gereja profesional untuk Sistem Informasi Manajemen Gereja (SIM-GEREJA). Anda membantu Pendeta, Majelis, dan Staff dalam hal administrasi gereja, penyiapan materi khotbah, manajemen keuangan gereja, ide kegiatan jemaat, dan konseling dasar. Jawablah dengan sopan, penuh kasih, dan sesuai dengan nilai-nilai Kristiani.",
        }
      });
      return response.text || "Maaf, saya tidak dapat memproses permintaan saat ini.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Terjadi kesalahan saat menghubungkan ke AI Assistant.";
    }
  }
};