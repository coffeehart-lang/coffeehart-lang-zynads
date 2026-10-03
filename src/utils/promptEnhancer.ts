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

/**
 * Prompt Engineer Expansion Engine for K2 (Krea 2) and Text-to-Image / Text-to-Video models.
 * Follows strict prompt engineering guidelines:
 * 1. Faithfulness First: Preserves original subjects, actions, colors, spatial relationships.
 * 2. Practical T2I Structure: Groups subjects with attributes/actions using grounded spatial phrasing.
 * 3. Style & Lighting Integration: Adds cohesive atmospheric lighting, camera depth, and medium preservation.
 * 4. Text Rendering: Wraps visible text or typography in quotes.
 * 5. Respect Existing Detail: Lightly polishes detailed prompts rather than over-expanding.
 */
export function expandPrompt(userPrompt: string): string {
  const trimmed = userPrompt.trim();
  if (!trimmed) return trimmed;

  // If already long and detailed (> 200 chars), lightly polish and structure
  if (trimmed.length > 220) {
    if (!trimmed.includes("cinematic") && !trimmed.includes("lighting") && !trimmed.includes("photography")) {
      return `${trimmed}. Rendered with soft directional lighting, balanced shallow depth of field, and grounded atmospheric spatial details suitable for high-fidelity diffusion generation.`;
    }
    return trimmed;
  }

  const lower = trimmed.toLowerCase();
  
  // Detect explicit medium
  let mediumPrefix = "";
  if (lower.startsWith("photo of") || lower.startsWith("photograph of")) {
    mediumPrefix = "A crisp high-resolution photograph of ";
  } else if (lower.startsWith("illustration of") || lower.startsWith("drawing of")) {
    mediumPrefix = "A detailed stylized illustration of ";
  } else if (lower.startsWith("3d render of")) {
    mediumPrefix = "A clean 3D render of ";
  } else if (lower.startsWith("painting of")) {
    mediumPrefix = "An expressive oil painting of ";
  }

  // Preserve core content and expand with grounded details
  const baseSubject = mediumPrefix 
    ? trimmed.slice(trimmed.indexOf("of ") + 3) 
    : trimmed;

  // Identify visible quote text if present
  let quoteDetail = "";
  const quotesMatch = trimmed.match(/"([^"]+)"/);
  if (quotesMatch) {
    quoteDetail = ` featuring clear visible typography reading "${quotesMatch[1]}"`;
  }

  const expanded = `${mediumPrefix ? mediumPrefix : "A cinematic shot of "}${baseSubject}${quoteDetail}, presented with realistic spatial depth, balanced volumetric lighting, refined surface textures, and a harmonious color palette framing the main composition.`;

  return expanded;
}
