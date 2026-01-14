
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
  
  // Formatar contexto da equipe baseado no modo de visualização
  const teamContext = users.map(u => {
    if (viewMode === 'mensal' && selectedMonth !== undefined) {
      // Modo mensal: mostrar dias específicos do mês
      const monthName = months[selectedMonth];
      const vacationDays = u.plannedVacations;
      return `- ${u.name} (${u.role}): Status ${u.status}, Férias em ${monthName}: ${vacationDays.length > 0 ? vacationDays.join(', ') : 'Nenhuma'}`;
    } else {
      // Modo anual: mostrar férias por mês
      const annualData: { [month: number]: number[] } = {};
      u.plannedVacations.forEach(vacation => {
        // Decodificar formato: mês*1000 + dia
        const month = Math.floor(vacation / 1000);
        const day = vacation % 1000;
        if (!annualData[month]) {
          annualData[month] = [];
        }
        annualData[month].push(day);
      });
      
      const vacationsByMonth = Object.entries(annualData)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([month, days]) => {
          const monthName = months[parseInt(month) - 1];
          const totalDays = days.length;
          return `${monthName} (${totalDays} dia${totalDays > 1 ? 's' : ''}): dias ${days.join(', ')}`;
        })
        .join('; ');
      
      return `- ${u.name} (${u.role}): Status ${u.status}, Férias no ano: ${vacationsByMonth || 'Nenhuma'}`;
    }
  }).join('\n');

  const periodContext = viewMode === 'mensal' && selectedMonth !== undefined && selectedYear !== undefined
    ? `${months[selectedMonth]} de ${selectedYear}`
    : selectedYear !== undefined
    ? `ano de ${selectedYear}`
    : 'período selecionado';

  const prompt = `
    Abaixo está uma lista da equipe e seus status de férias para o ${periodContext}. 
    Gere um resumo executivo curto (máximo 150 palavras) em Português do Brasil para o gestor de RH.
    Destaque quem está de férias no ${periodContext} e se há algum risco de sobrecarga ou muitos usuários ausentes.
    ${viewMode === 'anual' ? 'Analise a distribuição de férias ao longo do ano e identifique períodos críticos ou meses com alta concentração de ausências.' : ''}
    
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
