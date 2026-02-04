
import { GoogleGenAI } from "@google/genai";
import { User } from "./types";

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const generateTeamSummary = async (
  users: User[], 
  viewMode: 'mensal' | 'anual' = 'mensal',
  selectedMonth?: number,
  selectedYear?: number
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  let teamContext: string;
  let periodDescription: string;

  if (viewMode === 'mensal' && selectedMonth !== undefined && selectedYear !== undefined) {
    const monthName = months[selectedMonth];
    periodDescription = `${monthName} de ${selectedYear}`;
    teamContext = users.map(u => 
      `- ${u.name} (${u.role}): Status ${u.status}, Férias em ${monthName}: ${u.plannedVacations.length > 0 ? u.plannedVacations.join(', ') : 'Nenhuma'}`
    ).join('\n');
  } else if (viewMode === 'anual' && selectedYear !== undefined) {
    periodDescription = `ano de ${selectedYear}`;
    // For annual view, we need to aggregate all months
    teamContext = users.map(u => {
      const totalVacationDays = u.plannedVacations.length;
      return `- ${u.name} (${u.role}): Status ${u.status}, Total de dias de férias em ${selectedYear}: ${totalVacationDays} dias`;
    }).join('\n');
  } else {
    periodDescription = 'período atual';
    teamContext = users.map(u => 
      `- ${u.name} (${u.role}): Status ${u.status}, Férias: ${u.plannedVacations.length > 0 ? u.plannedVacations.join(', ') : 'Nenhuma'}`
    ).join('\n');
  }

  const prompt = `
    Abaixo está uma lista da equipe e seus status de férias para o ${periodDescription}. 
    Gere um resumo executivo curto (máximo 150 palavras) em Português do Brasil para o gestor de RH.
    Destaque quem está de férias e se há algum risco de sobrecarga ou muitos usuários ausentes no ${periodDescription}.
    
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
