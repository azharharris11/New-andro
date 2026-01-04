import { Type } from "@google/genai";
import { ProjectContext, CreativeFormat, GenResult, MarketAwareness } from "../../types";
import { generateWithRetry, extractJSON } from "./client";
import { 
    PromptContext, 
    ENHANCERS, 
    getSafetyGuidelines, 
    getCulturePrompt, 
    getPersonaVisualContext, 
    parseAngle, 
    getSubjectFocus 
} from "./imageUtils";
import { generateAIWrittenPrompt } from "./imagePrompts";

export const generateCreativeImage = async (
  project: ProjectContext,
  persona: any,
  angle: string,
  format: CreativeFormat,
  visualScene: string,
  visualStyle: string,
  aspectRatio: string = "1:1",
  embeddedText: string,
  referenceImageBase64?: string,
  congruenceRationale?: string
): Promise<GenResult<{ imageUrl: string | null; finalPrompt: string }>> => {
  
  // NANO BANANA PRO LOGIC:
  // Use Gemini 3 Pro for complex text rendering and "Thinking" capability
  const model = project.imageModel === 'pro' 
      ? "gemini-3-pro-image-preview" 
      : "gemini-2.5-flash-image"; 

  console.log(`🎨 Generating Image using Model: ${model} | Format: ${format}`);
  
  const country = project.targetCountry || "USA";
  const parsedAngle = parseAngle(angle);
  const culturePrompt = getCulturePrompt(country);
  const personaVisuals = getPersonaVisualContext(persona);

  // Note: We move the specific "Lighting/Mood" logic to imagePrompts.ts 
  // to allow for more narrative randomization.
  const moodPrompt = `Mood: High conversion native ad.`; 
  
  const subjectFocus = getSubjectFocus(
    project.marketAwareness || MarketAwareness.PROBLEM_AWARE, 
    personaVisuals, 
    parsedAngle, 
    project
  );

  const isUglyFormat = [
    CreativeFormat.UGLY_VISUAL, 
    CreativeFormat.MS_PAINT, 
    CreativeFormat.MEME, 
    CreativeFormat.CARTOON, 
    CreativeFormat.STICKY_NOTE_REALISM, 
    CreativeFormat.BIG_FONT,
    CreativeFormat.PHONE_NOTES,
    CreativeFormat.REDDIT_THREAD
  ].includes(format);

  const isNativeStory = [
    CreativeFormat.UGC_MIRROR, CreativeFormat.TWITTER_REPOST, 
    CreativeFormat.SOCIAL_COMMENT_STACK, CreativeFormat.HANDHELD_TWEET, 
    CreativeFormat.EDUCATIONAL_RANT, CreativeFormat.CHAT_CONVERSATION, 
    CreativeFormat.DM_NOTIFICATION, CreativeFormat.REMINDER_NOTIF
  ].includes(format);

  // DETERMINE ENHANCER: PRIORITIZE "UGLY/RAW"
  let appliedEnhancer = ENHANCERS.PROFESSIONAL;
  if (isUglyFormat) appliedEnhancer = ENHANCERS.NANO_BANANA_RAW; 
  else if (isNativeStory || format === CreativeFormat.CAROUSEL_REAL_STORY) appliedEnhancer = ENHANCERS.UGC;

  const safety = getSafetyGuidelines(isUglyFormat);
  
  const fullStoryContext = {
      story: persona.storyData,
      mechanism: persona.mechanismData,
      bigIdea: persona.bigIdeaData,
      massDesire: persona.massDesireData 
  };

  const ctx: PromptContext = {
      project, format, parsedAngle, visualScene, visualStyle, 
      textCopyInstruction: "", 
      personaVisuals, moodPrompt, culturePrompt, 
      subjectFocus,
      enhancer: appliedEnhancer,
      safety,
      fullStoryContext,
      congruenceRationale,
      aspectRatio,
      rawPersona: persona,
      embeddedText,
      // Pass reference flag to prompt generator
      hasReferenceImage: !!(referenceImageBase64 || project.productReferenceImage)
  };

  // STEP 1: Generate the ONE UNIFIED NARRATIVE PROMPT
  const finalPrompt = await generateAIWrittenPrompt(ctx);

  // STEP 2: Construct the Parts for Nano Banana (Text Prompt + Optional Reference Image)
  const parts: any[] = [{ text: finalPrompt }];
  
  // LOGIC: Reference Image Handling
  // We prioritize the uploaded reference image specific to this generation, then fallback to project product image.
  const refImage = referenceImageBase64 || project.productReferenceImage;
  
  if (refImage) {
      const base64Data = refImage.split(',')[1] || refImage;
      // Add image at the START of the prompt context for better attention
      parts.unshift({ inlineData: { mimeType: "image/png", data: base64Data } });
      
      // Explicit instruction for the model to use the image
      parts.push({ text: " \n\nIMPORTANT: Use the provided image as the primary subject reference. Maintain the product's key visual identity (logo, shape, color) while adapting the lighting to fit the described narrative scene naturally." });
  }

  try {
    const isPro = model.includes("gemini-3-pro");
    
    // CONFIGURATION: Ensure High Resolution for Pro
    // Gemini 3 Pro supports "2K" resolution.
    const imageConfig: any = {
        aspectRatio: aspectRatio === "1:1" ? "1:1" : "9:16",
    };
    
    if (isPro) {
        imageConfig.imageSize = "2K"; // Explicitly request 2K for better text/detail
    }

    const response = await generateWithRetry({
      model,
      contents: { parts },
      config: { imageConfig }
    });

    let imageUrl: string | null = null;
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }
    return {
      data: { imageUrl, finalPrompt },
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0
    };
  } catch (error) {
    console.error("Image Gen Error", error);
    return { data: { imageUrl: null, finalPrompt }, inputTokens: 0, outputTokens: 0 };
  }
};

export const generateCarouselSlides = async (
  project: ProjectContext,
  format: CreativeFormat,
  angle: string,
  visualScene: string,
  visualStyle: string,
  fullStrategyContext: any,
  congruenceRationale?: string
): Promise<GenResult<{ imageUrls: string[]; prompts: string[] }>> => {
    // Logic for carousel remains largely similar but uses the new model selection logic
    const model = "gemini-2.0-flash-exp"; // Fast thinking model for prompts
    const imageModel = project.imageModel === 'pro' ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

    const promptGenPrompt = `
      ROLE: Creative Director (Nano Banana Narrative Style).
      TASK: Create 3 CONNECTED but DISTINCT narrative image prompts for a carousel ad.
      
      CONTEXT:
      Format: ${format}
      Angle: ${angle}
      Scene Base: ${visualScene}
      
      METHODOLOGY:
      Write 3 Descriptive Paragraphs (Narratives). 
      - Slide 1: Hook/Problem (Focus on the pain point visually).
      - Slide 2: Agitation/Process (Show the struggle or the mechanism working).
      - Slide 3: Solution/Result (The 'After' state or the product saving the day).
      
      OUTPUT JSON:
      {
          "slides": [
              "Narrative paragraph for slide 1...",
              "Narrative paragraph for slide 2...",
              "Narrative paragraph for slide 3..."
          ]
      }
    `;

    let slidePrompts: string[] = [];
    let promptTokens = 0;
    
    try {
        const response = await generateWithRetry({
            model,
            contents: promptGenPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slides: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["slides"]
                }
            }
        });
        const data = extractJSON<{slides: string[]}>(response.text || "{}");
        slidePrompts = data.slides || [];
        promptTokens += (response.usageMetadata?.promptTokenCount || 0);
    } catch (e) {
        console.error("Failed to generate slide prompts", e);
        slidePrompts = [visualScene, visualScene, visualScene]; 
    }

    const imageUrls: string[] = [];
    let outputTokens = 0;
    const isPro = imageModel.includes("gemini-3-pro");

    for (const slidePrompt of slidePrompts) {
        try {
            const imageRes = await generateWithRetry({
                model: imageModel,
                contents: { parts: [{ text: slidePrompt }] },
                config: { 
                    imageConfig: { 
                        aspectRatio: "1:1",
                        // @ts-ignore
                        imageSize: isPro ? "2K" : undefined
                    } 
                }
            });

            if (imageRes.candidates && imageRes.candidates[0].content.parts) {
                for (const part of imageRes.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
                        break;
                    }
                }
            }
            outputTokens += (imageRes.usageMetadata?.candidatesTokenCount || 0);
        } catch (e) {
            console.error("Slide Image Gen Error", e);
        }
    }

    return {
        data: { imageUrls, prompts: slidePrompts },
        inputTokens: promptTokens,
        outputTokens: outputTokens
    };
};