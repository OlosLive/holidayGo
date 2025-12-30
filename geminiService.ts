
import { GoogleGenAI } from "@google/genai";
import { User } from "./types";

export const generateTeamSummary = async (users: User[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const teamContext = users.map(u => 
    `- ${u.name} (${u.role}): Status ${u.status}, Férias este mês: ${u.plannedVacations.length > 0 ? u.plannedVacations.join(',') : 'Nenhuma'}`
  ).join('\n');

  const prompt = `
    Abaixo está uma lista da equipe e seus status de férias. 
    Gere um resumo executivo curto (máximo 150 palavras) em Português do Brasil para o gestor de RH.
    Destaque quem está de férias e se há algum risco de sobrecarga ou muitos usuários ausentes.
    
    Equipe:
    ${teamContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o resumo no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA para gerar o resumo.";
  }
};
