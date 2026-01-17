
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

    rawPersona?: any;
    embeddedText?: string;
    aspectRatio?: string;
    subjectFocus: string;
    fullStoryContext: any;
    congruenceRationale?: string;
    hasReferenceImage?: boolean; // Added type definition
}


/**
 * ENHANCERS: Updated for "Authentic Native" (Nano Banana Pro v2).
 * Goal: Look like a high-quality organic post, not a low-quality trashy image.
 */export const ENHANCERS = {
    // Dulu: "High-end commercial photography..." -> SEKARANG: Corporate Candid
    PROFESSIONAL: "Shot on DSLR, neutral lighting, f/5.6 aperture (everything in focus), minimal editing, corporate documentary style, authentic skin texture.",
    
    // Dulu: "Shot on iPhone 15..." -> SEKARANG: Raw Phone Photo
    UGC: "Phone photography (iPhone 11 quality), unedited JPEG, messy real-life background, flat lighting, 'point-and-shoot' aesthetic.",
    
    // Dulu: "Authentic Social..." -> SEKARANG: Low-Fi / Amateur
    NANO_BANANA_RAW: `
        STYLE: AMATEUR SNAPSHOT.
        CAMERA: Low-budget smartphone camera.
        LIGHTING: Overhead fluorescent light or direct harsh flash. NO "Golden Hour". NO "Cinematic Lighting".
        QUALITY:  flat colors (low saturation), 
        VIBE: "I just took this picture in my room", authentic, cringe, raw reality.
        NEGATIVE PROMPT: 3d render, illustration, painting, octane render, studio lighting, bokeh, professional color grading, hdr, vibrant.
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
