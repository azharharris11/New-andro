
import { CreativeFormat } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO: ONE-SHOT STRATEGY
 * Simpler, Direct, and Strategy-Dense.
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
        project, format, visualScene, 
        embeddedText, fullStoryContext,
        rawPersona, hasReferenceImage,
        parsedAngle
    } = ctx;

    const isFlat = isFlatUIFormat(format);
    const isLongForm = format === CreativeFormat.IG_STORY_TEXT || format === CreativeFormat.LONG_TEXT;

    // 1. KUMPULKAN SEMUA "BUMBU DAPUR" (STRATEGY STACK)
    const strategyStack = {
        product: project.productName,
        description: project.productDescription,
        country: project.targetCountry || "General",
        audience: project.targetAudience,
        voice: project.brandVoice || "Professional",
        awareness: project.marketAwareness,
        framework: project.copyFramework,
        
        // The Deep Strategy Nodes (Ancestry)
        massDesire: fullStoryContext?.massDesireData?.headline || "General Relief",
        bigIdea: fullStoryContext?.bigIdeaData?.concept || "New Opportunity",
        persona: rawPersona?.profile || "Target Customer",
        painPoint: rawPersona?.visceralSymptoms?.[0] || "General Pain",
        story: fullStoryContext?.storyData?.narrative || "User Journey",
        mechanism: fullStoryContext?.mechanismData?.scientificPseudo || "The Solution",
        angle: parsedAngle.cleanAngle,
        
        // The Execution Container
        format: format,
        uiGuide: getFormatTextGuide(format)
    };

    // 2. TENTUKAN VIBE VISUAL BERDASARKAN FORMAT
    const visualVibe = isFlat
        ? "DIRECT DIGITAL SCREENSHOT. Flat 2D Design. Vector Quality. Pixel Perfect UI. NO Camera Lens. NO Depth of Field. NO Angle."
        : "Cinematic, Photorealistic, 8k, High-End Photography, Emotional Lighting, Shot on 35mm lens.";

    // 3. BUAT "MEGA PROMPT" YANG SIMPEL & LANGSUNG
    const systemPrompt = `
    ROLE: World-Class AI Visual Director (Nano Banana System).
    
    TASK: Synthesize the provided STRATEGY STACK into a single, high-fidelity image generation prompt.

    *** THE STRATEGY STACK (CONTEXT) ***
    - PRODUCT: ${strategyStack.product} (${strategyStack.description})
    - TARGET COUNTRY: ${strategyStack.country}
    - TARGET AUDIENCE: ${strategyStack.audience}
    - BRAND VOICE: ${strategyStack.voice}
    - MARKET AWARENESS: ${strategyStack.awareness}
    
    *** THE PSYCHOLOGICAL BLUEPRINT ***
    - MASS DESIRE (Root): "${strategyStack.massDesire}"
    - BIG IDEA (Bridge): "${strategyStack.bigIdea}"
    - PERSONA (Who): ${strategyStack.persona} (Suffering from: "${strategyStack.painPoint}")
    - STORY ARC: "${strategyStack.story}"
    - MECHANISM (Logic): "${strategyStack.mechanism}"
    - CHOSEN ANGLE: "${strategyStack.angle}"

    *** THE EXECUTION FORMAT (STRICT RULES) ***
    - FORMAT NAME: ${strategyStack.format}
    - UI/DESIGN RULES: ${strategyStack.uiGuide}
    
    *** VISUAL INSTRUCTION ***
    Create a detailed image prompt that visually narrates this specific strategy. 
    You MUST strictly follow the UI RULES for the visual container and text style.
    
    1. **CONTAINER & POV (CRITICAL):** 
       ${isFlat 
         ? `**TYPE: DIRECT SCREENSHOT / FLAT UI.**
            - You are generating the INTERFACE itself, NOT a photo of a phone.
            - DO NOT describe a hand, a desk, a camera angle, or lighting glare.
            - The image boundaries must match the screen edges perfectly.
            - Look like a high-quality vector export or a direct screen capture from the app.` 
         : `**TYPE: PHOTOGRAPHIC / CINEMATIC.**
            - Explicitly describe the medium/frame (e.g., "A handheld POV shot of an iPhone 15...", "A cinematic wide shot...").
            - Describe lighting, depth of field, and texture.`
       }
    
    2. **TEXT ADAPTATION & TRANSLATION (CRITICAL):**
       - The provided context for the text is: "${embeddedText}".
       - **TARGET LANGUAGE:** **${strategyStack.country}** (If Indonesia, use Bahasa Indonesia. If USA, use English).
       - **TASK:** You MUST rewrite/translate the context into the **Target Language** and **Native Format**.
         ${isLongForm 
            ? `- **LONG FORM RULE:** The user wants a "Wall of Text" style (3-4 paragraphs). Rewrite the context into a vulnerable, storytelling paragraph in ${strategyStack.country} language. **Do NOT summarize it**. Keep it long.` 
            : `- If Twitter: Rewrite as a casual tweet (lowercase, hashtags, handle) using ${strategyStack.country} slang.
               - If Sticky Note: Rewrite as a short handwritten reminder (3-5 words) in ${strategyStack.country} language.
               - If Notification: Rewrite as a short, urgent lockscreen message in ${strategyStack.country} language.
               - If Search Bar: Rewrite as a user query in ${strategyStack.country} language.`
         }
       - **OUTPUT RULE:** In the final prompt, you must explicitly write: "The image features text that says: '[YOUR ADAPTED TEXT]'."
    
    3. **SCENE & ACTION:** 
       - Visualise the Persona/Scene defined in the strategy.
       - **CONTEXTUAL MATCHING:** If the text sounds professional (Authority POV), show a clean, upscale environment. If the text sounds like a raw confession (Diarist POV), show a lived-in, authentic, slightly messy environment.
    
    4. **MOOD & LIGHTING:** 
       - If Angle is PAIN: Use dim, moody, cool, or high-contrast lighting. 
       - If Angle is SOLUTION: Use bright, warm, soft, or golden hour lighting.
    
    5. **STYLE:** ${visualVibe}

    **OUTPUT:** 
    Return ONLY the final prompt paragraph. No conversational filler.
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
        return `A high quality photo for ${strategyStack.product}. Text says: "${embeddedText}". Style: ${strategyStack.format}.`; 
    }
};
