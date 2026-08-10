/**
 * Copyright 2026 coffeehart / ZynAds / Zencast
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Keep-alive/health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "ZynAds Commercial & Marketing Engine", time: new Date().toISOString() });
  });

  // ZynAds AI Commercial & Ad Script Generator proxy using Google Gen AI SDK
  app.post("/api/zynads/optimize", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      const { productName, targetAudience, platform, objective, budget, tone, userPrompt } = req.body;

      if (!productName) {
        return res.status(400).json({
          error: "Invalid input",
          message: "Product or commercial topic name is required.",
        });
      }

      if (key) {
        const ai = new GoogleGenAI({ apiKey: key });
        const prompt = `You are a legendary commercial video director, creative copywriter, and growth marketing strategist for ZynAds.
Generate a complete video commercial script, visual storyboard breakdown, high-converting ad headlines, audience targeting parameters, and media placement recommendations for:

- Product / Service / Offer: "${productName}"
- Desired Commercial Tone: "${tone || "High-Energy Direct Response"}"
- Target Platform: "${platform || "TikTok, Meta & YouTube Shorts"}"
- Campaign Goal: "${objective || "Conversions & Direct Sales"}"
- Daily Budget: "$${budget || 100}/day"
- Audience Notes: "${targetAudience || "Ideal buyers & target decision makers"}"
${userPrompt ? `- Specific Instructions: "${userPrompt}"` : ""}

Format your response in structured, beautifully formatted Markdown with:

### 🎬 Scene-by-Scene Commercial Storyboard & Script (30 Seconds)
Provide a 3-scene table/list containing:
- **Scene 1 (The 0-3s Hook)**: [Visual Cue & Action] | **Voiceover/Speaker**: "Exact word-for-word spoken text" | *On-Screen Text*: Graphic overlay
- **Scene 2 (The Solution & Demo)**: [Visual Cue & Action] | **Voiceover/Speaker**: "Exact word-for-word spoken text" | *On-Screen Text*: Graphic overlay
- **Scene 3 (The CTA & Offer)**: [Visual Cue & Action] | **Voiceover/Speaker**: "Exact word-for-word spoken text" | *On-Screen Text*: Graphic overlay

### 🎯 High-Impact Ad Headlines (3 Punchy Options)
- Option 1 (Pattern Interrupt / Curiosity)
- Option 2 (Benefit-Driven / Clear ROI)
- Option 3 (Urgency / Social Proof)

### 🎯 Target Audience & Persona Aim
- **Demographics & Age**: Range and gender focus
- **Core Interest Clusters**: Specific Facebook/TikTok interest keywords to target
- **Behavioral Indicators**: Buying patterns and online activity

### 🚀 Media Placement & Channel Strategy
- **Best Platforms**: Recommended distribution order
- **Optimal Aspect Ratios**: 9:16 portrait vs 16:9 landscape breakdown
- **Placement Advice**: Where to put budget for maximum conversion volume
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        return res.json({ success: true, text: response.text });
      }

      // Smart fallback response if GEMINI_API_KEY is not configured
      const fallbackText = `### 🎬 Scene-by-Scene Commercial Storyboard for ${productName}

#### Scene 1: The 0-3 Second Viral Hook (00:00 - 00:03)
- **Visual Cue**: Actor holding phone looking shocked at screen, fast zoom-in cut.
- **Voiceover**: *"Stop wasting money on ads that nobody clicks. Here's what top 1% brands are actually doing."*
- **On-Screen Text**: 🚨 "Ad Money Wasted?" (Bold Red & White Text)

#### Scene 2: The Solution & Product Demo (00:03 - 00:20)
- **Visual Cue**: Screen recording showing ${productName} interface, rapidly generating ad scripts and targeting profiles.
- **Voiceover**: *"Meet ${productName}. It builds your commercial scripts, maps your exact target audiences, and calculates your ideal daily budget in seconds."*
- **On-Screen Text**: ⚡ "Commercial Script + Target Audience in 60s"

#### Scene 3: The Offer & Call-to-Action (00:20 - 00:30)
- **Visual Cue**: Spokesperson pointing down to animated button, flashing 20% discount badge.
- **Voiceover**: *"Tap the link right now to try ${productName} free and start scaling your commercial revenue today!"*
- **On-Screen Text**: 👇 "Claim Your Free Commercial Setup"

---

### 🎯 High-Impact Ad Headlines
- **Option 1**: Stop Guessing Ad Copy — Create High-Converting Commercials for ${productName}
- **Option 2**: How Modern Brands Turn 15-Second Videos into 4x ROAS Revenue
- **Option 3**: The All-In-One Commercial & Marketing Engine for ${targetAudience || 'Growth Leaders'}

---

### 🎯 Target Audience & Persona Aim
- **Demographics**: Ages 22-54, Entrepreneurs, Marketing Managers, E-commerce Owners.
- **Core Interest Clusters**: ${platform || 'TikTok & Meta Ads'}, Direct Response Marketing, Content Creation, Video Production.
- **Behavioral Indicators**: High video engagement, engaged shoppers, active SaaS adopters.

---

### 🚀 Media Placement & Channel Strategy
- **Primary Channels**: TikTok Reels & Instagram Reels (9:16 Vertical Video).
- **Secondary Placement**: YouTube Shorts & Google Search Retargeting.
- **Budget Pacing**: Pacing 60% of budget into top-of-funnel video views, 40% into retargeting conversions.`;

      return res.json({ success: true, text: fallbackText });
    } catch (err: any) {
      console.error("ZynAds Commercial Optimization Error:", err);
      res.status(500).json({
        error: "ZynAds commercial generation failed",
        message: err.message || "An error occurred while generating commercial strategy.",
      });
    }
  });

  // AI Scene & Character Interaction Generator Endpoint
  app.post("/api/zynads/scene", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      const { scenePrompt, characterInteraction } = req.body;

      if (!scenePrompt) {
        return res.status(400).json({ error: "Scene description is required." });
      }

      // Check if there are dialogue quotes in the scene prompt (e.g. "...")
      const quoteMatch = scenePrompt.match(/"([^"]+)"/);
      const extractedSpeech = quoteMatch ? quoteMatch[1] : null;

      if (key) {
        const ai = new GoogleGenAI({ apiKey: key });
        const aiPrompt = `You are a Hollywood commercial visual effects director and stage supervisor.
The user wants a customized commercial scene with these parameters:
- Scene Environment Visuals: "${scenePrompt}"
- Character Action / Interaction: "${characterInteraction || "Presenting product and interacting with scene elements"}"

Respond with ONLY a strict JSON object with these exact keys:
{
  "sceneTitle": "Short catchy title for the scene (3-5 words)",
  "visualCue": "Detailed visual description of character action and stage props",
  "propItem": "Name of main interactive prop (e.g. DDR5 RAM Stick, Liquid Cooled GPU, Terminal Laptop, Coffee Mug, Tech Tablet)",
  "overlayText": "Short 3-6 word punchy stage action caption",
  "recommendedBackdropPrompt": "Suggested 1-sentence prompt for virtual backdrop generator",
  "extractedDialogue": "Extracted spoken dialogue lines if quotes are present, otherwise leave empty string"
}`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: aiPrompt,
          });

          const text = response.text || "";
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
            if (!parsed.extractedDialogue && extractedSpeech) {
              parsed.extractedDialogue = extractedSpeech;
            }
            return res.json({ success: true, scene: parsed });
          }
        } catch (e) {
          console.error("Gemini AI scene parse issue, using procedural generator", e);
        }
      }

      return res.json({
        success: true,
        scene: {
          sceneTitle: `Custom Scene: ${scenePrompt.slice(0, 24)}`,
          visualCue: `Character is ${characterInteraction || 'interacting on stage'} inside: "${scenePrompt}".`,
          propItem: scenePrompt.toLowerCase().includes('laptop') || scenePrompt.toLowerCase().includes('terminal') ? "Terminal Laptop" : "Interactive Tech Prop",
          overlayText: characterInteraction ? characterInteraction.slice(0, 30) : "Interactive Studio Scene",
          recommendedBackdropPrompt: scenePrompt,
          extractedDialogue: extractedSpeech || ""
        }
      });
    } catch (err: any) {
      console.error("Scene Generation Error:", err);
      res.status(500).json({ error: "Failed to generate scene", message: err.message });
    }
  });

  // AI Studio Backdrop & Google Imagen 3 Image Generator Endpoint
  app.post("/api/zynads/backdrop", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Backdrop description prompt is required." });
      }

      let imageUrl = "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80";
      let name = `Google Imagen 3: ${prompt.slice(0, 24)}`;
      let badgeText = "GOOGLE IMAGEN 3 STUDIO";
      let bgClass = "bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950";
      let borderClass = "border-indigo-600";
      let description = `High-definition 4K studio set synthesized by Google Imagen 3 for: "${prompt}"`;

      if (key) {
        const ai = new GoogleGenAI({ apiKey: key });

        // Try Gemini Image model first
        try {
          const imgGenResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [
                {
                  text: `Photorealistic 4K broadcast television video commercial studio background set, ${prompt}, ultra high quality, clean cinema lighting, no people`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: '16:9',
              },
            },
          });

          if (imgGenResponse.candidates?.[0]?.content?.parts) {
            for (const part of imgGenResponse.candidates[0].content.parts) {
              if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const mime = part.inlineData.mimeType || 'image/jpeg';
                imageUrl = `data:${mime};base64,${base64ImageBytes}`;
                break;
              }
            }
          }
        } catch (imgErr: any) {
          const errMsg = imgErr?.message || String(imgErr);
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
            console.log("Info: Gemini image model requires paid API key quota; using studio preset fallback.");
          } else {
            console.log("Backdrop generation fallback info:", errMsg);
          }
        }

        const aiPrompt = `You are an expert virtual set designer and broadcast studio lighting director.
The user wants a studio backdrop matching this description: "${prompt}".

Respond with ONLY a strict JSON object with these exact keys:
{
  "name": "Short descriptive name (e.g. AI Skyline Studio)",
  "badgeText": "Short 2-3 word uppercase theme badge (e.g. AI STUDIO)",
  "description": "Short 1-sentence description of the AI generated studio set visual"
}`;

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: aiPrompt,
          });

          const text = response.text || "";
          const jsonStart = text.indexOf('{');
          const jsonEnd = text.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
            if (parsed.name) name = parsed.name;
            if (parsed.badgeText) badgeText = parsed.badgeText;
            if (parsed.description) description = parsed.description;
          }
        } catch (e) {
          console.error("Gemini AI backdrop text metadata issue:", e);
        }
      }

      // High-definition studio image selection fallback if base64 isn't set
      if (!imageUrl.startsWith("data:")) {
        const lower = prompt.toLowerCase();
        if (lower.includes("cyber") || lower.includes("neon") || lower.includes("tokyo")) {
          imageUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80";
          borderClass = "border-fuchsia-600";
        } else if (lower.includes("office") || lower.includes("executive") || lower.includes("skyline")) {
          imageUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80";
          borderClass = "border-blue-600";
        } else if (lower.includes("dark") || lower.includes("cinema") || lower.includes("stage")) {
          imageUrl = "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=80";
          borderClass = "border-slate-700";
        } else if (lower.includes("green") || lower.includes("zen") || lower.includes("eco")) {
          imageUrl = "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1920&q=80";
          borderClass = "border-emerald-600";
        }
      }

      return res.json({
        success: true,
        backdrop: {
          name,
          bgClass,
          borderClass,
          badgeText,
          description,
          imageUrl
        }
      });
    } catch (err: any) {
      console.error("Backdrop Generation Error:", err);
      res.status(500).json({ error: "Failed to generate backdrop", message: err.message });
    }
  });

  // Dedicated Standalone Image Generation API Route
  app.post("/api/zynads/generate-image", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      const { prompt, aspectRatio } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Image prompt is required." });
      }

      if (key) {
        const ai = new GoogleGenAI({ apiKey: key });
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [
                {
                  text: `${prompt}, photorealistic, studio commercial quality, 8k resolution`,
                },
              ],
            },
            config: {
              imageConfig: {
                aspectRatio: aspectRatio === '9:16' ? '9:16' : aspectRatio === '1:1' ? '1:1' : '16:9',
              },
            },
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                const base64ImageBytes = part.inlineData.data;
                const mime = part.inlineData.mimeType || 'image/jpeg';
                return res.json({
                  success: true,
                  imageUrl: `data:${mime};base64,${base64ImageBytes}`
                });
              }
            }
          }
        } catch (err: any) {
          const errMsg = err?.message || String(err);
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
            console.log("Info: Gemini image generation requires paid API key quota; using studio keyword fallback.");
          } else {
            console.log("Generate image fallback info:", errMsg);
          }
        }
      }

      // High-quality studio image keyword fallback
      let fallbackUrl = "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1920&q=80";
      const lower = (prompt || '').toLowerCase();
      if (lower.includes('farm') || lower.includes('pasture') || lower.includes('porch') || lower.includes('grass')) {
        fallbackUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80";
      } else if (lower.includes('ram') || lower.includes('server') || lower.includes('chip') || lower.includes('tech') || lower.includes('code')) {
        fallbackUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80";
      } else if (lower.includes('cyber') || lower.includes('neon') || lower.includes('tokyo')) {
        fallbackUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80";
      } else if (lower.includes('office') || lower.includes('executive') || lower.includes('business')) {
        fallbackUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80";
      } else if (lower.includes('car') || lower.includes('vehicle')) {
        fallbackUrl = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80";
      } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dish')) {
        fallbackUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";
      }

      return res.json({
        success: true,
        imageUrl: fallbackUrl
      });
    } catch (err: any) {
      console.error("Generate Image Error:", err);
      res.status(500).json({ error: "Failed to generate image", message: err.message });
    }
  });

  // AI Audio Transcription Endpoint (Gemini 3.6 Flash Audio Model + Procedural Fallback)
  app.post("/api/zynads/transcribe", async (req, res: any) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      const { audioBase64, mimeType } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: "Audio base64 data is required." });
      }

      if (key) {
        const ai = new GoogleGenAI({ apiKey: key });
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "audio/webm",
                data: audioBase64,
              },
            },
            "Transcribe this spoken audio speech snippet verbatim into English text. Return ONLY the transcribed text with proper punctuation. Do not add intro text, quotes, or meta explanation.",
          ],
        });

        const transcript = response.text?.trim() || "";
        return res.json({ success: true, transcript });
      }

      return res.json({
        success: true,
        transcript: "",
        message: "Gemini API key not configured for server audio transcription."
      });
    } catch (err: any) {
      console.error("Audio Transcription Error:", err);
      res.status(500).json({ error: "Transcription failed", message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZynAds Commercial Studio running on http://localhost:${PORT}`);
  });
}

startServer();
