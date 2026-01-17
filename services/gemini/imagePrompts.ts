import { CreativeFormat } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO: DYNAMIC THINKING ENGINE
 * AI acts as both Copywriter & Visual Director.
 */

// List of formats that must look like a RAW SCREENSHOT (No camera, no hand, no 3D)
const isFlatUIFormat = (format: CreativeFormat): boolean => {
    const flatFormats = [
        CreativeFormat.TWITTER_REPOST, 
        CreativeFormat.GMAIL_UX, 
        CreativeFormat.DM_NOTIFICATION,
        CreativeFormat.REMINDER_NOTIF, 
        CreativeFormat.CHAT_CONVERSATION, 
        CreativeFormat.REDDIT_THREAD,
        CreativeFormat.PHONE_NOTES, 
        CreativeFormat.SEARCH_BAR, 
        CreativeFormat.SOCIAL_COMMENT_STACK,
        CreativeFormat.US_VS_THEM,
        CreativeFormat.STORY_POLL,
        CreativeFormat.STORY_QNA,
        CreativeFormat.IG_STORY_TEXT,
        CreativeFormat.LONG_TEXT
    ];
    return flatFormats.includes(format);
};

export const generateAIWrittenPrompt = async (ctx: PromptContext): Promise<string> => {
    const { 
        project, format, 
        parsedAngle, 
        fullStoryContext,
        rawPersona
    } = ctx;

    // 1. STRATEGY STACK
    const strategyStack = {
        product: project.productName,
        description: project.productDescription,
        country: project.targetCountry || "General",
        hook: parsedAngle.cleanAngle, // HOOK DIAMBIL DARI SINI
        persona: rawPersona?.profile || "Target Customer",
        painPoint: rawPersona?.visceralSymptoms?.[0] || "General Pain",
        identity: fullStoryContext?.meta?.voiceAnchor || "Adaptive Persona",
        format: format,
        uiGuide: getFormatTextGuide(format)
    };

    // 2. DYNAMIC THINKING PROMPT
    const systemPrompt = `
    ROLE: World-Class AI Creative Director & Copywriter (Nano Banana System).
    
    TASK: Analyze the Strategic Context and generate a high-fidelity Image Prompt + Text Overlay.

    *** 🧠 STEP 1: THE STRATEGIC CONTEXT ***
    - PRODUCT: ${strategyStack.product}
    - TARGET COUNTRY: ${strategyStack.country} (Language: Native & Localized)
    - FORMAT: ${strategyStack.format}
    - IDENTITY (Voice): ${strategyStack.identity}
    
    =========== THE CORE MESSAGE ===========
    - MARKETING HOOK: "${strategyStack.hook}"
    - PERSONA PAIN: "${strategyStack.painPoint}"
    ========================================

    *** ✍️ STEP 2: DYNAMIC COPYWRITING (THINK & WRITE) ***
    You must determine the writing style YOURSELF based on the Context above.
    
    **LOGIC PROTOCOL:**
    IF Format is 'Twitter/Reddit/Text' -> Use raw, lower-case, typos, internet slang.
    IF Format is 'Notification/Chat' -> Use urgent, intimate, short bursts.
    IF Identity is 'Skeptic' -> Be cynical, questioning, use words like "scam", "honest".
    IF Identity is 'Authority' -> Be professional, use data, clear grammar.
    
    **YOUR MISSION:**
    Write the text overlay based on the MARKETING HOOK: "${strategyStack.hook}".
    - Do NOT just copy the hook. ADAPT it to the format.
    - LANGUAGE: ${strategyStack.country} Native.

    *** 🎨 STEP 3: VISUAL EXECUTION ***
    Create the final image prompt.
    1. **CONTAINER:** Strictly follow these UI Rules: ${strategyStack.uiGuide}
    2. **SCENE:** Visualise the environment where this Persona (${strategyStack.identity}) lives.
    3. **TEXT INJECTION:**
       You MUST explicitly write: "The image features text that says: '[YOUR GENERATED TEXT]'."

    **OUTPUT:** Return ONLY the final prompt paragraph.
    `;
    
    try {
        const response = await generateWithRetry({
            model: "gemini-3-flash-preview", 
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
                temperature: 0.85, 
            }
        });
        
        let prompt = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        return prompt;

    } catch (e) {
        console.error("Prompt Gen Error:", e);
        // FIX: Ganti 'embeddedText' (yg sudah dihapus) menjadi 'strategyStack.hook'
        return `A high quality photo for ${strategyStack.product}. Text says: "${strategyStack.hook}". Style: ${strategyStack.format}.`; 
    }
};