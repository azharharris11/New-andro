
import { CreativeFormat } from "../../types";

/**
 * SOURCE OF TRUTH FOR NATIVE TEXT RENDERING STYLES (Nano Banana Pro).
 * Refined for Realism, Platform Accuracy, Brand Safety, and Dynamic Layouts.
 */
export const getFormatTextGuide = (format: CreativeFormat): string => {
    const baseGuide = "TEXT RENDERING INSTRUCTION:";
    
    switch (format) {
    // --- 1. STORYTELLING GROUP (IG Story, Long Text) ---
        case CreativeFormat.IG_STORY_TEXT:
        case CreativeFormat.LONG_TEXT:
            return `${baseGuide}
            
            
            **YOUR ROLE:** You are a world-class Visual Storyteller.
            
            **1. VISUAL DIRECTION (TOTAL FREEDOM):**
            - Do NOT follow a fixed template.
            - Analyze the *emotion* and *context* of the text you are writing.
            - **Generate a background and visual style that perfectly amplifies that specific emotion.**
            - It could be dark, bright, blurred, sharp, minimalist, or chaotic—YOU DECIDE based on what fits best.
            
            **2. TYPOGRAPHY:**
            - Use a modern, native font (like San Francisco).
            **SMART HIGHLIGHT:** You MUST apply a background color highlight (Yellow/Blue/Green) to the *most important phrase* to make it pop.
            - **Emphasis:** Intelligent use of Background Highlights (like Instagram's 'A' tool) on key phrases is highly recommended to break monotony.

            **3. NARRATIVE FLOW:**
            - Write a seamless "Stream of Consciousness" story (Vertical Flow).
            - Start with a strong Hook/Trigger -> Pivot to Insight -> End with Vision/CTA.
            - Keep it authentic. No corporate slang.
            `;
        case CreativeFormat.STORY_POLL:
            return `${baseGuide} STYLE: Instagram Story Poll Sticker. Digital UI element floating on a blurred background.`;
        case CreativeFormat.STORY_QNA:
            return `${baseGuide} STYLE: Instagram Q&A Sticker Response. Digital UI white box with rounded corners.`;
        case CreativeFormat.PHONE_NOTES:
            return `${baseGuide} STYLE: Apple Notes App UI. Full screen white background with yellow header text.`;
        case CreativeFormat.TWITTER_REPOST:
        case CreativeFormat.HANDHELD_TWEET:
            return `${baseGuide} STYLE: X Post UI - DARK MODE. Perfect 2D screenshot rendering.`;
        case CreativeFormat.GMAIL_UX:
            return `${baseGuide} STYLE: Gmail Mobile Inbox. Digital list view.`;
        case CreativeFormat.DM_NOTIFICATION:
        case CreativeFormat.REMINDER_NOTIF:
            return `${baseGuide} STYLE: iOS Lockscreen Notification Banner. Digital 2D graphic.`;
        case CreativeFormat.CHAT_CONVERSATION:
            return `${baseGuide} STYLE: Mobile Chat Interface (iMessage or WhatsApp). Digital bubbles on 2D background.`;
        case CreativeFormat.SEARCH_BAR:
            return `${baseGuide} STYLE: Google Mobile Search. Flat digital 2D.`;
        case CreativeFormat.REDDIT_THREAD:
            return `${baseGuide} STYLE: Reddit App UI - Dark Mode. 2D Screenshot.`;
        case CreativeFormat.SOCIAL_COMMENT_STACK:
            return `${baseGuide} STYLE: Social Media Comments Overlay. Semi-transparent digital list.`;
        case CreativeFormat.REELS_THUMBNAIL:
            return `${baseGuide} STYLE: Instagram Reels Cover. Cinematic photo with digital text overlay.`;
        case CreativeFormat.UGC_MIRROR:
            return `${baseGuide} STYLE: Mirror Selfie photography.`;
        case CreativeFormat.EDUCATIONAL_RANT:
            return `${baseGuide} STYLE: Screenshot of a video with green-screen background and text captions.`;
        case CreativeFormat.WHITEBOARD:
            return `${baseGuide} STYLE: Physical whiteboard photography.`;
        case CreativeFormat.MEME:
            return `${baseGuide} STYLE: Modern Meme Layout (White header with black text above an image).`;
        case CreativeFormat.COLLAGE_SCRAPBOOK:
            return `${baseGuide} STYLE: Artistic digital collage.`;
        case CreativeFormat.UGLY_VISUAL:
        case CreativeFormat.MS_PAINT:
             return `${baseGuide} STYLE: Crude digital drawing.`;
        case CreativeFormat.STICKY_NOTE_REALISM:
             return `${baseGuide} STYLE: Close-up photo of a physical sticky note.`;
        case CreativeFormat.BIG_FONT:
        case CreativeFormat.BILLBOARD:
            return `${baseGuide} STYLE: Massive bold typography layout.`;
        case CreativeFormat.US_VS_THEM:
            return `${baseGuide} STYLE: Digital comparison table, flat 2D graphic.`;
        case CreativeFormat.BEFORE_AFTER:
        case CreativeFormat.OLD_ME_VS_NEW_ME:
            return `${baseGuide} STYLE: Photo-realistic split screen.`;
        case CreativeFormat.TIMELINE_JOURNEY:
             return `${baseGuide} STYLE: Infographic roadmap.`;
        case CreativeFormat.CHECKLIST_TODO:
            return `${baseGuide} STYLE: Minimalist digital checklist.`;
        case CreativeFormat.TESTIMONIAL_HIGHLIGHT:
        case CreativeFormat.CAROUSEL_TESTIMONIAL:
            return `${baseGuide} STYLE: Floating digital quote card with star ratings.`;
        case CreativeFormat.PRESS_FEATURE:
            return `${baseGuide} STYLE: News article headline overlay on top of photo.`;
        case CreativeFormat.GRAPH_CHART:
        case CreativeFormat.VENN_DIAGRAM:
             return `${baseGuide} STYLE: Clean vector data visualization.`;
        default:
            return `${baseGuide} STYLE: Integrated text overlay.`;
    }
};
