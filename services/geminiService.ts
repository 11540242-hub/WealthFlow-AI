import { GoogleGenAI } from "@google/genai";
import { Stock, StockUpdateResult } from "../types";

// Ensure API Key is present
const API_KEY = process.env.API_KEY;

// Initialize Gemini
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const isGeminiAvailable = (): boolean => !!ai;

/**
 * Uses Gemini Search Grounding to find the latest stock prices.
 * This simulates a "Real-time" feed without a paid financial API.
 */
export const fetchStockUpdates = async (stocks: Stock[]): Promise<StockUpdateResult[]> => {
  if (!ai) throw new Error("Gemini API Key not found.");
  if (stocks.length === 0) return [];

  const symbols = stocks.map(s => s.symbol).join(", ");
  const prompt = `Find the current stock price for these symbols: ${symbols}. 
  Return the result as a JSON array of objects where each object has "symbol", "price", and "currency".
  If it is a Taiwan stock (ending in .TW), assume TWD. If US stock, assume USD.
  Do not use markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    if (response.text) {
      const text = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text) as StockUpdateResult[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
};

/**
 * Generates financial advice based on user data.
 */
export const generateFinancialAdvice = async (
  totalAssets: number, 
  netWorth: number, 
  topExpenseCategory: string
): Promise<string> => {
  if (!ai) return "AI service unavailable. Please check your API settings.";

  const prompt = `
    I am a personal finance assistant.
    User Stats:
    - Total Assets: ${totalAssets}
    - Net Worth: ${netWorth}
    - Top Expense Category: ${topExpenseCategory}
    
    Give me a short, 2-sentence encouraging advice or tip for the user.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Keep tracking your expenses to build wealth!";
  } catch (error) {
    console.error("Advice generation error", error);
    return "Keep up the good work managing your finances!";
  }
};