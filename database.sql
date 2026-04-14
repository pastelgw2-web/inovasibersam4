
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Menganalisis ide inovasi untuk menyarankan kategori, keahlian teknis,
   * serta memberikan evaluasi kritis dan rekomendasi bagi curator.
   */
  async analyzeInnovation(title: string, description: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Evaluate this Indonesian innovation proposal for our Crowdfunding & Volunteer platform: 
        Title: ${title}
        Description: ${description}
        
        Provide a professional evaluation in Indonesian:
        1. A concise professional tagline.
        2. A list of 3-5 technical skills required for volunteers.
        3. A feasibility score (0-100).
        4. A Grade (Grade A: Exceptional, Grade B: Good, Grade C: Needs Improvement).
        5. A comprehensive AI Recommendation (Verdict) for the curator to decide (Accept/Reject/Revise).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tagline: { type: Type.STRING },
              requiredSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              feasibilityScore: { type: Type.NUMBER },
              grade: { type: Type.STRING },
              recommendation: { type: Type.STRING }
            }
          }
        }
      });
      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return null;
    }
  },

  /**
   * Mencocokkan keahlian relawan dengan deskripsi proyek.
   */
  async matchVolunteer(skills: string[], projectDescriptions: string[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given these user skills: ${skills.join(", ")}, 
        And these project descriptions: ${projectDescriptions.join(" || ")},
        Rank the projects by matching relevance and explain why briefly in Indonesian.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Matching Error:", error);
      return "Analisis pencocokan saat ini tidak tersedia.";
    }
  }
};
