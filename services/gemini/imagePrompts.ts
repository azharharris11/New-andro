
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
        CreativeFormat.BIG_FONT, CreativeFormat.MEME, CreativeFormat.US_VS_THEM
    ];
    return digitalFormats.includes(format);
};

const getDynamicVibe = (format: CreativeFormat): string => {
    if (isDigitalFormat(format)) {
        // --- UBAH BAGIAN INI UNTUK HASIL CLEAN SCREENSHOT ---
        return `
        - **VIBE:** High-Fidelity Digital UI Design (Clean Flat Graphic).
        - **DETAILS:** Perfect pixel alignment, sharp vector-like text, solid hex colors.
        - **REALISM:** It must look like a DIRECT SCREENSHOT or Digital Export (PNG). NO screen glare, NO tilt, NO camera blur, NO fingerprints.
        - **PERSPECTIVE:** Perfectly flat 90-degree front-facing view.
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
    ROLE: Cinematic Visual Storyteller & Advertising Director.
    
    TASK: Write a rich, narrative-driven image generation prompt optimized for Gemini 3 Pro (Nano Banana Pro).
    
    **CORE PHILOSOPHY: NARRATIVE OVER TEMPLATES.**
    Do NOT use rigid lists like "Subject: Cat, Lighting: Good".
    Instead, write a fluid paragraph that describes the scene, the movement, and the technical photography details as a cohesive story.
    
    **REQUIRED PROMPT ELEMENTS (The "Thinking" Framework):**
    1. **CINEMATOGRAPHY:** Specify the Lens (e.g., "85mm macro", "35mm wide"), Camera (e.g., "Leica M6", "iPhone 15 Pro"), and Angle.
    2. **NARRATIVE ACTION:** Describe the moment being captured. "A runner breathing heavily at the peak of a mountain..."
    3. **LIGHTING & ATMOSPHERE:** Use emotive words. "Dappled sunlight filtering through leaves," "Harsh neon buzz," "Soft window diffusion."
    4. **INTENT & FOCUS:** Explain *why* the shot looks this way. "To highlight the condensation on the can..."
    
    **EXAMPLE (Aim for this style):**
    "A photorealistic shot taken with an 85mm macro lens. Sharp focus on the dew drops on the surface of a soda can, while the beach party background behind is rendered in soft, creamy bokeh to create an energetic summer atmosphere while keeping the attention strictly on the product's freshness."
    
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
            model: "gemini-2.0-flash-exp", 
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
                temperature: 0.9, // Higher temperature for more creative/descriptive variance
            }
        });
        
        let prompt = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        // Failsafe for embedded text
        if (embeddedText && !prompt.includes(embeddedText)) {
            prompt += ` Ensure the text "${embeddedText}" is clearly visible and legible in the style described.`;
        }
        
        return prompt;

    } catch (e) {
        console.error("Prompt Gen Error:", e);
        return `A cinematic shot of ${visualScene}, captured in a ${format} style. Lighting is dramatic. Context: ${niche}.`; 
    }
};
