/**
 * AI Studio & Gemini API Runner for ZynAds / Zyncast Suite
 * Copyright (c) 2026 Coffeehart
 */

import { GoogleGenAI } from "@google/genai";

async function runInference() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY environment variable provided. Skipping live AI Studio inference test.");
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Hello from ZynAds Suite CI! Confirm connection status in 1 sentence.",
    });

    const outputText = response.text ?? JSON.stringify(response, null, 2);
    console.log("✅ AI Studio Response Success:\n", outputText);
  } catch (error) {
    console.error("❌ AI Studio Response Error:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

runInference();
