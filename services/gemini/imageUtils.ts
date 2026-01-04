
import { ProjectContext, CreativeFormat, MarketAwareness, HumanDesire } from "../../types";

export interface ParsedAngle {
    cleanAngle: string;
    context: string;
    isPainFocused: boolean;
    isSolutionFocused: boolean;
    isUrgent: boolean;
}

export interface PromptContext {
    project: ProjectContext;
    format: CreativeFormat;
    parsedAngle: ParsedAngle;
    visualScene: string; 
    visualStyle: string; 
    textCopyInstruction: string;
    personaVisuals: string; 
    moodPrompt: string;
    culturePrompt: string;
    enhancer: string;
    safety?: string;
    rawPersona?: any;
    embeddedText?: string;
    aspectRatio?: string;
    subjectFocus: string;
    fullStoryContext: any;
    congruenceRationale?: string;
    hasReferenceImage?: boolean; // Added type definition
}

export const getSafetyGuidelines = (isUglyOrMeme: boolean): string => {
  const COMMON_RULES = `
    1. Humans must look realistic unless specified as cartoon.
  `;

  return `
    ${COMMON_RULES}
    5. NO realistic "before/after" split screens that violate platform policies.
  `;
};

/**
 * ENHANCERS: Updated for "Authentic Native" (Nano Banana Pro v2).
 * Goal: Look like a high-quality organic post, not a low-quality trashy image.
 */
export const ENHANCERS = {
    PROFESSIONAL: "High-end commercial photography, 8k, shot on Phase One, studio lighting, clean composition.",
    
    UGC: "Shot on iPhone 15, authentic creator vibe, natural home lighting, realistic skin textures, no filters, slightly imperfect framing.",
    
    NANO_BANANA_RAW: `
        STYLE: "AUTHENTIC SOCIAL" REALISM.
        CAMERA: Modern Smartphone (iPhone 15 Pro or Google Pixel), sharp focus, high resolution.
        LIGHTING: Soft natural morning light, diffused window light. AVOID harsh flash.
        ENVIRONMENT: Real home setting (lived-in, authentic textures), but NOT filthy/garbage.
        VIBE: Viral organic post, "Aesthetically Real", candid, user-generated content.
        NO: perfect symmetry, 3D render look, blurriness, pixelation, overly dark shadows.
    `
};

/**
 * SOULMATE VISUAL INJECTION
 * Translates abstract Persona attributes into specific PHYSICAL flaws and environmental clutter.
 */
export const getPersonaVisualContext = (persona: any): string => {
    const painPoints = (persona.visceralSymptoms || []).join(", ");
    const profile = persona.profile || "";
    
    // Auto-detect visual cues based on text keywords
    let visualFlaws = "";
    if (painPoints.includes("tired") || painPoints.includes("sleep")) visualFlaws += "Subject has visible dark circles under eyes, messy hair bun, slightly oily skin texture. ";
    if (painPoints.includes("acne") || painPoints.includes("skin")) visualFlaws += "Subject has visible skin texture, pores, redness, no makeup, authentic skin reality. ";
    if (painPoints.includes("fat") || painPoints.includes("weight")) visualFlaws += "Subject wears loose comfortable clothing, posture is slightly slumped (vulnerable). ";
    if (painPoints.includes("money") || painPoints.includes("debt")) visualFlaws += "Environment is cluttered, stack of papers/bills visible in background, modest furniture. ";

    return `
        **VISUAL SOULMATE IDENTITY (STRICT):**
        - WHO: A realistic person matching description: "${profile}".
        - PHYSICAL REALITY: ${visualFlaws || "Authentic, candid appearance. Not a model."}
        - CONTEXT: ${painPoints}.
        - ENVIRONMENT: A realistic, lived-in space. If they are a parent, show toys on the floor. If they are busy, show a messy desk. MAKE IT LOOK LIVED IN.
    `;
};

/**
 * PSYCHOLOGY TO CINEMATOGRAPHY MAP
 * Translates Mass Desire into Camera Angles & Lighting.
 */
export const getDesireVisualCues = (desireType: string): string => {
    switch (desireType) {
        case HumanDesire.SUPERIORITY:
        case "Status":
            return "CAMERA: Low Angle (Heroic/Dominant). LIGHTING: High contrast, spotlight on subject. COMPOSITION: Subject in center, looking down at lens or looking away confidently.";
        case HumanDesire.PAIN_FREEDOM:
        case "Pain":
            return "CAMERA: High Angle (Vulnerable/Small) or Extreme Close Up (Intense). LIGHTING: Dim, moody, shadows hiding parts of the room. COMPOSITION: Claustrophobic or isolated.";
        case HumanDesire.COMFORT:
        case "Comfort":
            return "CAMERA: Eye Level (Relatable). LIGHTING: Warm, soft, Golden Hour or Window Light. COMPOSITION: Open, cozy, soft textures prominent.";
        case HumanDesire.SEXUAL:
            return "CAMERA: Close up on features. LIGHTING: Warm, red/orange hues, soft focus. COMPOSITION: Intimate depth of field.";
        default:
            return "CAMERA: Dutch Angle (Slight tilt) for dynamic energy. LIGHTING: Natural/Bright.";
    }
};

/**
 * PROMPT STRUCTURE ROULETTE (CHAOS MODE)
 * Prevents "Same-y" generations by forcing the LLM to start sentences differently.
 */
export const getChaosStructure = (): string => {
    const structures = [
        "STRUCTURE A (Action First): Start by describing the ACTION happening, then reveal the subject.",
        "STRUCTURE B (Atmosphere First): Start by describing the LIGHTING and MOOD, then the environment, then the subject.",
        "STRUCTURE C (Technical First): Start by describing the CAMERA LENS and ANGLE, then what it is capturing.",
        "STRUCTURE D (Detail First): Start with an extreme close-up detail (a hand, an object, a texture) and zoom out to the scene."
    ];
    return structures[Math.floor(Math.random() * structures.length)];
};

export const parseAngle = (angle: string): ParsedAngle => {
    const cleanAngle = angle.trim().replace(/^"|"$/g, '');
    const lower = cleanAngle.toLowerCase();
    
    return {
        cleanAngle,
        context: "",
        isPainFocused: /pain|problem|struggle|tired|failed|worst/i.test(lower),
        isSolutionFocused: /fix|solve|cure|relief|trick|hack/i.test(lower),
        isUrgent: /now|today|immediately|urgent/i.test(lower)
    };
};

export const getCulturePrompt = (country: string): string => {
  if (!country) return "";
  return `SETTING: ${country} context. Ensure the environment, architectural style, and background characters match ${country}.`;
};

export const getSubjectFocus = (
    marketAwareness: MarketAwareness,
    personaVisuals: string,
    parsedAngle: ParsedAngle,
    project: ProjectContext
): string => {
    if (marketAwareness === MarketAwareness.UNAWARE) {
        return "Focus on an ANOMALY or TEXTURE close-up. Create a 'Curiosity Gap'. Do NOT show the product logo clearly yet.";
    }if (marketAwareness === MarketAwareness.PROBLEM_AWARE) 
    {
        return "Focus on the SYMPTOM. Show the problem clearly in a well-lit environment. Sharp macro shot.";
    }
    if (marketAwareness === MarketAwareness.SOLUTION_AWARE) {
        return "Focus on the COMPARISON or the MECHANISM. Show a crude but clear 'Us vs Them' setup on a table.";
    }
    return "Focus on the PRODUCT in a HAND-HELD shot. Product held by a hand in a living room/bathroom, clear focal point.";
};
