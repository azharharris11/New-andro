
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
  
  const model = project.imageModel === 'pro' 
      ? "gemini-3-pro-image-preview" 
      : "gemini-2.5-flash-image"; 

  const country = project.targetCountry || "USA";
  const parsedAngle = parseAngle(angle);
  const culturePrompt = getCulturePrompt(country);
  const personaVisuals = getPersonaVisualContext(persona);
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
      hasReferenceImage: !!(referenceImageBase64 || project.productReferenceImage)
  };

  const finalPrompt = await generateAIWrittenPrompt(ctx);
  const parts: any[] = [{ text: finalPrompt }];
  const refImage = referenceImageBase64 || project.productReferenceImage;
  
  if (refImage) {
      const base64Data = refImage.split(',')[1] || refImage;
      parts.unshift({ inlineData: { mimeType: "image/png", data: base64Data } });
      parts.push({ text: " \n\nIMPORTANT: Use provided image as reference." });
  }

  try {
    const isPro = model.includes("gemini-3-pro");
    const imageConfig: any = {
        aspectRatio: aspectRatio === "1:1" ? "1:1" : "9:16",
    };
    if (isPro) imageConfig.imageSize = "2K";

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
    return { data: { imageUrl: null, finalPrompt: "" }, inputTokens: 0, outputTokens: 0 };
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
    const model = "gemini-2.0-flash-exp";
    const imageModel = project.imageModel === 'pro' ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

    const promptGenPrompt = `Create 3 narrative image prompts for carousel. Format: ${format}. Scene: ${visualScene}.`;

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
