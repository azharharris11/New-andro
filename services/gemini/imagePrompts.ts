
import { CreativeFormat } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext, ENHANCERS } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO DYNAMIC STRATEGY:
 * Implements "Narrative Thinking" Prompts.
 * Moves away from keywords to cinematic storytelling.
 */

const isDigitalFormat = (format: CreativeFormat): boolean => {
    const digitalFormats = [
        CreativeFormat.IG_STORY_TEXT, CreativeFormat.STORY_QNA, CreativeFormat.STORY_POLL,
        CreativeFormat.TWITTER_REPOST, CreativeFormat.GMAIL_UX, CreativeFormat.DM_NOTIFICATION,
        CreativeFormat.REMINDER_NOTIF, CreativeFormat.CHAT_CONVERSATION, CreativeFormat.REDDIT_THREAD,
        CreativeFormat.PHONE_NOTES, CreativeFormat.SEARCH_BAR, CreativeFormat.SOCIAL_COMMENT_STACK,
        CreativeFormat.LONG_TEXT, CreativeFormat.BIG_FONT, CreativeFormat.MEME, CreativeFormat.US_VS_THEM,
    ];
    return digitalFormats.includes(format);
};

const getDynamicVibe = (format: CreativeFormat): string => {
    if (isDigitalFormat(format)) {
        return `
        - **VIBE:** High-Fidelity DIRECT DIGITAL EXPORT (Native App UI).
        - **PERSPECTIVE:** 100% Perfectly Flat 90-degree front-facing view. 
        - **CRITICAL:** DO NOT show a physical phone, DO NOT show a hand holding a phone, DO NOT show a table or background. 
        - **REALISM:** This must look like a high-resolution PNG screenshot. The text must be sharp, anti-aliased, and pixel-perfect.
        - **DETAILS:** Use authentic app interface elements (status bars, icons) where appropriate for the format.
        `;
    } else {
        return `
        - **VIBE:** Cinematic, emotive, high-end editorial or raw documentary style.
        - **LIGHTING:** Use dramatic, motivated lighting (e.g., God rays, chiaroscuro, neon spill, golden hour).
        - **COMPOSITION:** Avoid boring center-framing. Use leading lines, negative space, or dutch angles if appropriate.
        - **TEXTURE:** Focus on tactile details (skin texture, fabric weave, rust, condensation).
        `;
    }
};

export const generateAIWrittenPrompt = async (ctx: PromptContext): Promise<string> => {
    const { 
        project, format, visualScene, 
        embeddedText, fullStoryContext,
        rawPersona, hasReferenceImage 
    } = ctx;

    const dynamicVibe = getDynamicVibe(format);
    
    // Data Extraction
    const massDesire = fullStoryContext?.massDesire?.headline || "Deep Desire";
    const painPoint = rawPersona?.visceralSymptoms?.[0] || "Core Pain";
    const niche = `${project.productName} (${project.productDescription})`;
    const uiInstruction = getFormatTextGuide(format);

    // SYSTEM PROMPT UPGRADED FOR "THINKING MODE" COMPATIBILITY
    const systemPrompt = `
    ROLE: High-End Digital UI Designer & Cinematic Director.
    
    TASK: Write a rich, narrative-driven image generation prompt optimized for Gemini 3 Pro (Nano Banana Pro).
    
    **REQUIRED PROMPT ELEMENTS (The "Thinking" Framework):**
    1. **CINEMATOGRAPHY:** Specify the View (e.g., "Direct flat top-down digital view" for UI, or "85mm shallow depth" for photo).
    2. **NARRATIVE ACTION:** Describe the content. 
    3. **LIGHTING & ATMOSPHERE:** Emotive descriptions.
    4. **INTENT & FOCUS:** Why it looks this way.
    
    **CONTEXT:**
    - Product/Niche: ${niche}
    - Visual Idea: ${visualScene}
    - Format Style: ${format}
    - Emotional Arc: ${painPoint} -> ${massDesire}

    **FORMAT RULES (UI/Overlay instructions):**
    ${uiInstruction}

    **VIBE CHECK:**
    ${dynamicVibe}
    
    ${hasReferenceImage ? "**REFERENCE INSTRUCTION:** Use the provided reference image as the primary subject anchor. Adapt its lighting and texture to match the narrative scene described above." : ""}

    **OUTPUT:**
    Return ONLY the final prompt paragraph. No "Here is the prompt". No markdown formatting.
    `;
    
    try {
        const response = await generateWithRetry({
            model: "gemini-3-flash-preview", 
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
                temperature: 0.9,
            }
        });
        
        let prompt = response.text?.trim() || "";
        
        // Failsafe for digital formats to ensure they aren't turned into physical mockups
        if (isDigitalFormat(format)) {
            prompt = `A direct, perfectly flat 2D digital UI screenshot. ${prompt}. No physical objects, no hands, no reflections. Sharp vector-like text rendering.`;
        }
        
        // Failsafe for embedded text
        if (embeddedText && !prompt.includes(embeddedText)) {
            prompt += ` Ensure the text "${embeddedText}" is clearly visible and legible in the style described.`;
        }
        
        return prompt;

    } catch (e) {
        console.error("Prompt Gen Error:", e);
        return `A perfectly flat digital 2D interface for ${format}, displaying the copy for ${visualScene}. Crisp typography, direct view.`; 
    }
};
