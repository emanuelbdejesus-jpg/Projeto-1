
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const getInventoryInsights = async (state: AppState): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const inventorySummary = state.inventory.map(i => `${i.name}: ${i.stock} em estoque (mínimo ${i.minStock})`).join('\n');
  const recentWithdrawals = state.withdrawals.slice(-10).map(w => `${w.quantity}x ${w.toolName} em ${w.date} por ${w.reason}`).join('\n');

  const prompt = `
    Como um consultor especialista em perfuração de rochas, analise o seguinte estoque:
    
    ESTOQUE ATUAL:
    ${inventorySummary}
    
    RETIRADAS RECENTES:
    ${recentWithdrawals}
    
    Por favor, forneça uma análise curta (máximo 150 palavras) em Português sobre:
    1. Quais ferramentas estão em nível crítico.
    2. Padrões de consumo anormais detectados.
    3. Recomendações para o próximo pedido de compra.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA para análise preditiva.";
  }
};
