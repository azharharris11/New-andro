// File: services/gemini/creative.ts

import { Type } from "@google/genai";
import { 
  ProjectContext, 
  CreativeFormat, 
  CreativeStrategyResult,
  GenResult, 
  StoryOption, 
  BigIdeaOption, 
  MechanismOption, 
  LanguageRegister, 
  StrategyMode,
  MarketAwareness
} from "../../types";
import { generateWithRetry, extractJSON } from "./client";
import { getFormatTextGuide } from "./imageText"; 

// --- 1. LONG FORM COPY GENERATOR ---
export const generateSalesLetter = async (
  project: ProjectContext,
  story: StoryOption,
  bigIdea: BigIdeaOption,
  mechanism: MechanismOption,
  hook: string,
  coliseumKeywords: string[] = [] 
): Promise<GenResult<string>> => {
  const model = "gemini-3-flash-preview";
  const country = project.targetCountry || "Indonesia";
  const awareness = project.marketAwareness || MarketAwareness.PROBLEM_AWARE;
  
  // 1. Vocabulary Injection
  let keywordInstruction = "";
  if (coliseumKeywords && coliseumKeywords.length > 0) {
      keywordInstruction = `
      **VOCABULARY RULE:** Naturally weave these insider words: [${coliseumKeywords.join(", ")}].
      `;
  }

  // 2. Framework Selection
  let framework = "";
  if (awareness === MarketAwareness.UNAWARE) {
      framework = `
      **FLOW: INDIRECT STORY (The Trojan Horse)**
      - Start with the HOOK concept (Observation/Feeling).
      - Transition to the Story (The Struggle).
      - Reveal the "Real Enemy" (Logic Shift).
      - Introduce the New Mechanism (${mechanism.scientificPseudo}).
      - Only then, mention ${project.productName}.
      `;
  } else {
      framework = `
      **FLOW: DIRECT RESPONSE (Problem-Agitate-Solve)**
      - Hit the Pain immediately with the HOOK.
      - Agitate the symptoms.
      - Pivot to Solution (${project.productName}) & Mechanism (${mechanism.scientificPseudo}).
      - Offer & Guarantee.
      `;
  }

  const prompt = `
    ROLE: World-Class Direct Response Copywriter.
    TASK: Write a high-converting Long-Form Ad in ${country} Native Language.
    
    **REFERENCE MATERIAL (USE THIS FOR CONTEXT ONLY):**
    - The Hook: "${hook}"
    - The Story Arc: "${story.narrative}"
    - The Mechanism: "${mechanism.scientificPseudo}" (How it works: ${mechanism.ums})
    - The Big Idea: "${bigIdea.headline}"
    - The Offer: "${project.offer}"
    
    ${keywordInstruction}
    ${framework}

    **CRITICAL WRITING RULES:**
    1. **NO HEADERS:** Do NOT write "Headline:" or "Phase 1:". Start directly with the story.
    2. **NO ECHO:** Do NOT repeat the Hook. Use it as the opening sentence/thought.
    3. **TONE:** Conversational, intimate, "Me to You". 
    
    **EXECUTION:**
    Write the ad now. Start directly.
  `;

  const response = await generateWithRetry({ model, contents: prompt });

  return {
    data: response.text || "",
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0
  };
};

// --- 2. CREATIVE STRATEGY / IMAGE TEXT GENERATOR ---
export const generateCreativeStrategy = async (
  project: ProjectContext, 
  fullStrategyContext: any, 
  angle: string, 
  format: CreativeFormat
): Promise<GenResult<CreativeStrategyResult>> => {
  const model = "gemini-3-flash-preview";
  const country = project.targetCountry || "Indonesia";
  
  // Extract Context
  const persona = fullStrategyContext || {};
  const personaPain = persona.visceralSymptoms ? persona.visceralSymptoms.join(", ") : "Frustration";
  const massDesire = fullStrategyContext?.massDesireData?.headline || "Solution";
  const mechanism = fullStrategyContext?.mechanismData?.scientificPseudo || "Secret Method";
  const storyNarrative = fullStrategyContext?.storyData?.narrative || "";
  
  // Extract Keywords
  const coliseumKeywords = persona.meta?.coliseumKeywords || persona.coliseumKeywords || [];
  let keywordInstruction = "";
  if (coliseumKeywords.length > 0) {
      keywordInstruction = `**VOCABULARY:** Use these keywords if they fit naturally: [${coliseumKeywords.join(", ")}]`;
  }

  // Get Visual Guide
  const formatInstruction = getFormatTextGuide(format);

  const prompt = `
    # ROLE: Creative Director (Native Ad Specialist)
    TASK: Design a Creative Asset for ${format} targeting ${country}.
    
    **INPUT CONTEXT (THE SOUL OF THE AD):**
    - **Angle/Hook:** "${angle}"
    - **Persona Pain:** ${personaPain}
    - **Core Desire:** ${massDesire}
    - **The Solution Mechanism:** ${mechanism}
    - **Backstory Context:** "${storyNarrative}" (Use this for mood/vibe only)
    ${keywordInstruction}
    
    **DESIGN LOGIC (SOURCE OF TRUTH):**
    ${formatInstruction}
    
    **OUTPUT REQUIREMENT:**
    Generate a JSON object containing the creative details.
    
    **RULES FOR 'embeddedText':**
    1. **INTEGRATION:** The text must be inspired by the *Angle* and *Backstory*, but fit the *Format*.
    2. **NO LABELS:** Never write "Hook:" or "Body:" inside the image text.
    3. **NO REPETITION:** Do not say the same thing twice.
    4. **VISUAL HARMONY:** Text must be concise enough to be legible.

    **OUTPUT JSON SCHEME:**
    - visualScene: (String) Description for the AI Image Generator.
    - visualStyle: (String) Lighting, camera, mood instructions.
    - embeddedText: (String) The actual text to be rendered on the image. CLEAN TEXT ONLY.
    - primaryText: (String) The caption/body copy (for IG Feed/FB).
    - headline: (String) The short headline (for FB/Meta headline field).
    - cta: (String) Button label.
    - uglyAdStructure: (Object) { keyword, emotion, qualifier, outcome }.
  `;

  try {
    const response = await generateWithRetry({
      model,
      contents: prompt,
      config: {
        temperature: 1.0, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualScene: { type: Type.STRING },
            visualStyle: { type: Type.STRING },
            embeddedText: { type: Type.STRING },
            primaryText: { type: Type.STRING },
            headline: { type: Type.STRING },
            cta: { type: Type.STRING },
            rationale: { type: Type.STRING },
            congruenceRationale: { type: Type.STRING },
            uglyAdStructure: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    emotion: { type: Type.STRING },
                    qualifier: { type: Type.STRING },
                    outcome: { type: Type.STRING }
                },
                required: ["keyword", "emotion", "qualifier", "outcome"]
            }
          },
          required: ["visualScene", "visualStyle", "embeddedText", "primaryText", "headline", "cta", "uglyAdStructure"]
        }
      }
    });

    return {
      data: extractJSON(response.text || "{}"),
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0
    };
  } catch (error) {
    console.error("Creative Strategy Error", error);
    throw error;
  }
};