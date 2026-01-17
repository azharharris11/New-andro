
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
  MarketAwareness,
  UglyAdStructure,
  AdIdentity
} from "../../types";
import { ai, extractJSON, generateWithRetry } from "./client";
import { getFormatTextGuide } from "./imageText"; 

const getPOVIdentity = (format: CreativeFormat): string => {
    // This is the fallback default, but the AI will now override this with specific archetypes
    return "ADAPTIVE";
};

// --- HELPER: LANGUAGE INSTRUCTION ---
const getLanguageInstruction = (country: string, register: LanguageRegister): string => {
    const isIndo = country?.toLowerCase().includes("indonesia");
    if (!isIndo) return `LANGUAGE: Native language of ${country}.`;

    if (register === LanguageRegister.SLANG) {
        return `LANGUAGE: Bahasa Indonesia (Gaya santai/Gaul). Gunakan 'Gue/Lo'.`;
    } else if (register === LanguageRegister.PROFESSIONAL) {
        return `LANGUAGE: Bahasa Indonesia (Formal). Gunakan 'Anda/Saya'.`;
    } else {
        return `LANGUAGE: Bahasa Indonesia (Casual). Gunakan 'Aku/Kamu'.`;
    }
};

// --- HELPER: BUILD STRATEGIC BRIEF ---
const buildStrategicBrief = (context: any): string => {
    let brief = "**STRATEGIC FOUNDATION (LOCKED - DO NOT CHANGE):**\n";
    
    // 0. MASS DESIRE (The Deepest Root - Always Present)
    if (context.massDesireData) {
        brief += `
        - PSYCHOLOGICAL ANCHOR (MASS DESIRE):
        - CORE DESIRE: "${context.massDesireData.headline}"
        - LIFE FORCE 8 TYPE: ${context.massDesireData.type}
        - MARKET SYMPTOM: "${context.massDesireData.marketSymptom}" (This is exactly what keeps them awake at night).
        `;
    }

    // 1. MECHANISM (Logic Path)
    if (context.mechanismData) {
        brief += `
        - CORE PILLAR: LOGIC / MECHANISM
        - UNIQUE MECHANISM: "${context.mechanismData.scientificPseudo}"
        - HOW IT WORKS: ${context.mechanismData.ums}
        - VISUAL FOCUS: Show the mechanism in action. Validate the logic.
        `;
    } 
    // 2. STORY (Emotion Path)
    else if (context.storyData) {
        brief += `
        - CORE PILLAR: EMOTION / STORY
        - NARRATIVE ARC: "${context.storyData.narrative}"
        - EMOTIONAL THEME: ${context.storyData.emotionalTheme}
        - VISUAL FOCUS: Dramatize this specific moment. Show the emotion.
        `;
    }
    // 3. BIG IDEA (Concept Path)
    else if (context.bigIdeaData) {
        brief += `
        - CORE PILLAR: CONCEPT / BIG IDEA
        - CONCEPT: "${context.bigIdeaData.concept}"
        - SHIFT: Moving from ${context.bigIdeaData.targetBelief} to New Opportunity.
        - VISUAL FOCUS: A metaphor or scene that represents this shift.
        `;
    }

    // 4. PERSONA (Always present)
    if (context.meta) {
        brief += `
        - TARGET WHO: ${context.meta.name}
        - VISCERAL PAIN: "${context.meta.visceralSymptoms?.[0] || 'General Pain'}"
        `;
    }

    return brief;
};

export const generateCreativeStrategy = async (
  project: ProjectContext, 
  fullStrategyContext: any, 
  angle: string, 
  format: CreativeFormat,
  isHVCOFlow: boolean = false,
  manualIdentity: AdIdentity | null = null // NEW: Accept manual identity override
): Promise<GenResult<CreativeStrategyResult>> => {
  const model = "gemini-3-flash-preview";
  // SAFEGUARD: ensure angle is a string
  const safeAngle = angle || "";
  const cleanAngle = safeAngle.replace(/^(Hook|Headline|Angle|Angle \d)\s*[:#-]\s*/i, "").replace(/["']/g, "").trim();
  const langInstruction = getLanguageInstruction(project.targetCountry || "USA", project.languageRegister || LanguageRegister.CASUAL);
  
  // Classify Format Type for Text Injection
  const isLongFormFormat = [CreativeFormat.IG_STORY_TEXT, CreativeFormat.LONG_TEXT].includes(format);
  const isTextLedFormat = [
    CreativeFormat.IG_STORY_TEXT, CreativeFormat.LONG_TEXT,
    CreativeFormat.TWITTER_REPOST, CreativeFormat.HANDHELD_TWEET,
    CreativeFormat.REDDIT_THREAD, CreativeFormat.PHONE_NOTES,
    CreativeFormat.GMAIL_UX, CreativeFormat.DM_NOTIFICATION,
    CreativeFormat.REMINDER_NOTIF, CreativeFormat.CHAT_CONVERSATION,
    CreativeFormat.SOCIAL_COMMENT_STACK
  ].includes(format);

  // --- 1. COPYWRITING LOCK ---
  const lockedHeadline = fullStrategyContext?.meta?.headline || fullStrategyContext?.headline || "";
  const lockedHook = fullStrategyContext?.meta?.hook || fullStrategyContext?.hook || cleanAngle;
  
  const copyDirective = lockedHeadline 
    ? `**COPYWRITING INSTRUCTION (STRICT):**
       - APPROVED VISUAL HEADLINE (For Image Overlay): "${lockedHeadline}"
       - APPROVED CAPTION HOOK (For Caption First Line): "${lockedHook}"
       - TASK: Execute this split strategy.`
    : `ANGLE: "${cleanAngle}"`;

  // --- 2. STRATEGY LOCK ---
  const strategicBrief = buildStrategicBrief(fullStrategyContext);

  // --- 3. VOC LOCK ---
  const coliseumKeywords = fullStrategyContext?.meta?.coliseumKeywords || fullStrategyContext?.coliseumKeywords || [];
  let keywordInstruction = "";
  if (coliseumKeywords.length > 0) {
      keywordInstruction = `
      **MANDATORY VOCABULARY (THE TRIBE LANGUAGE):**
      You MUST use these specific insider keywords in the 'primaryText' or 'embeddedText' if natural:
      [${coliseumKeywords.join(", ")}].
      `;
  }
  
  // --- 4. IDENTITY INSTRUCTION ---
  let identityInstruction = "";
  if (manualIdentity) {
      identityInstruction = `
      **MANDATORY VOICE ANCHOR:**
      You MUST adopt the persona of: "${manualIdentity}" throughout this creative.
      - **DO NOT** deviate from this character.
      - IF 'The Authority': Be strict, factual, and professional.
      - IF 'The Skeptic': Be cynical, use "I didn't believe it", and "honestly".
      - IF 'The Vulnerable Diarist': Be emotional, use "I'm shaking", "Deep secret".
      `;
  } else {
      identityInstruction = `
      **STEP 1: SELECT A VOICE ARCHETYPE (CRITICAL)**
      Instead of a generic user, pick the specific 'Character' who is speaking.
      Choose ONE that fits the Angle best:
      1. **THE SKEPTIC CONVERT:** "I didn't believe the hype, but..." (High Relatability).
      2. **THE AUTHORITY:** "As a specialist/founder, here is why X fails." (High Trust).
      3. **THE GATEKEEPER:** "Don't walk, RUN. I found the cheat code." (High Curiosity/Influencer).
      4. **THE OBSERVER (Case Study):** "Look at what happened to [Name] in 30 days." (Social Proof).
      5. **THE VULNERABLE DIARIST:** "I'm shaking writing this... I finally found it." (Deep Emotion).
      `;
  }

  const prompt = `
    # ROLE: Creative Director (Execution Phase)
    TASK: Visual Strategy for ${format}.
    
    ${langInstruction}
    
    ${strategicBrief}
    
    ${copyDirective}
    
    ${keywordInstruction}
    
    ${identityInstruction}

    **INSTRUCTIONS FOR 'visualScene':**
    - The scene MUST match the chosen Voice Archetype.
    - If AUTHORITY: Show a clean office, lab coat, or professional setting.
    - If SKEPTIC/DIARIST: Show a messy bedroom, car interior, or dimly lit room (authentic).
    - If GATEKEEPER: Show a bright aesthetic space or outdoor walk.
    - **NO AD COPY:** Do NOT describe text on the background. Only physical objects.
    
    **INSTRUCTIONS FOR 'embeddedText' (Image Overlay):**
    ${isLongFormFormat 
      ? `CRITICAL: This format is a "Wall of Text". Write a 40-60 word paragraph adopting the CHOSEN VOICE ARCHETYPE. 
         - If Authority: Use data, logic, and "I" statements.
         - If Skeptic: Admit your past doubts.
         - If Case Study: Describe someone else's transformation.
         - WRITE IN TARGET LANGUAGE.`
      : isTextLedFormat
        ? `This is a Text-First format. Write the content based on the APPROVED CAPTION HOOK ("${lockedHook}") using the CHOSEN VOICE ARCHETYPE. WRITE IN TARGET LANGUAGE.`
        : `This is a Visual-First format. The text overlay MUST be the APPROVED VISUAL HEADLINE ("${lockedHeadline}"). WRITE IN TARGET LANGUAGE.`
    }

    **INSTRUCTIONS FOR 'primaryText' (Ad Caption):**
    - This is the text BELOW/ABOVE the image (the post caption).
    - MUST start with 'APPROVED CAPTION HOOK' ("${lockedHook}").
    - Continue the copy naturally based on the 'STRATEGIC FOUNDATION' (Mass Desire + Story/Mechanism).
    - WRITE IN TARGET LANGUAGE.

    **OUTPUT JSON:**
    - visualScene: (Rich description of background/people/props/lighting)
    - visualStyle: (Photography style)
    - embeddedText: (The overlay text)
    - primaryText: (Ad caption - Must support the Approved Headline)
    - headline: (Meta Ads Headline - MUST be based on Approved Headline)
    - cta: (Button text)
    - rationale: (Why this works)
    - voiceAnchor: (Which archetype did you choose? e.g. "The Authority", "The Skeptic")
    - uglyAdStructure: { keyword, emotion, qualifier, outcome }
  `;

  const response = await generateWithRetry({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          visualScene: { type: Type.STRING },
          visualStyle: { type: Type.STRING },
          
          primaryText: { type: Type.STRING },
          headline: { type: Type.STRING },
          cta: { type: Type.STRING },
          rationale: { type: Type.STRING },
          voiceAnchor: { type: Type.STRING },
          uglyAdStructure: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              emotion: { type: Type.STRING },
              qualifier: { type: Type.STRING },
              outcome: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  return {
    data: extractJSON(response.text || "{}"),
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0
  };
};

export const generateSalesLetter = async (p: ProjectContext, s: StoryOption, b: BigIdeaOption, m: MechanismOption, h: string, k: string[] = []): Promise<GenResult<string>> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Write Gary Halbert style ad starting with: "${h}". Story: "${s.narrative}". Mechanism: "${m.scientificPseudo}". Keywords: ${k.join(", ")}.`;
  const response = await generateWithRetry({ model, contents: prompt });
  return { data: response.text || "", inputTokens: response.usageMetadata?.promptTokenCount || 0, outputTokens: response.usageMetadata?.candidatesTokenCount || 0 };
};
