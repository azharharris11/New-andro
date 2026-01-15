
import { CreativeFormat } from "../../types";

/**
 * SOURCE OF TRUTH FOR NATIVE TEXT RENDERING STYLES (Nano Banana Pro).
 * Refined for Realism, Platform Accuracy, Brand Safety, and Dynamic Layouts.
 */
export const getFormatTextGuide = (format: CreativeFormat): string => {
    const baseGuide = "TEXT RENDERING INSTRUCTION:";
    
    switch (format) {
        case CreativeFormat.LONG_TEXT:
             return `${baseGuide}
             VISUAL: 100% Full-Screen Digital Overlay. No mockup. No hand.
             STYLE: Instagram Story "Open Letter" / Wall of Text.
             LAYOUT: Perfectly centered white text on a solid dark charcoal background or a heavily blurred dark photo.
             STRUCTURE:
             1. THE HOOK (Large Bold Serif).
             2. THE AGITATION (Medium Sans-Serif).
             3. THE PIVOT (Italic).
             4. THE SOLUTION.
             5. THE CTA.`;

        case CreativeFormat.IG_STORY_TEXT:
            return `${baseGuide}
            STYLE: The "Complete Journey" Narrative (IG Story).
            
            VISUALS:
            - BACKGROUND: Aesthetic photo related to niche, HEAVILY DIMMED (60% Black Overlay) so white text pops.
            - FONT: Modern Sans-Serif (San Francisco style), White Text.
            - LAYOUT: Clean, airy, with spacing between paragraphs.
            
            **DYNAMIC WRITING INSTRUCTION:**
            Write ONE seamless story that takes the reader on an emotional journey. 
            Do NOT use headers like "Step 1". Just write the narrative naturally like a diary entry.

            **THE "ULTIMATE FLOW" STRUCTURE:**
            
            1. PHASE 1: THE TRIGGER (Sensory Start)
               - Start with a specific split-second of frustration.
               - Example: "Jam 2 pagi masih scroll..." or "Pas ngaca liat jerawat..."
               - Goal: Make them feel "Damn, that's me."

            2. PHASE 2: THE REALIZATION (The Pivot)
               - Zoom out and explain WHY. "Aku baru sadar, ternyata selama ini kita salah karena..."
               - Validate their struggle (It's not their fault, it's the old method).

            3. PHASE 3: THE VISION (The Dream)
               - "Padahal, bayangin kalau besok kamu bangun dan..."
               - Paint a picture of the result they want.
               - End with a subtle nudging towards [Product/Method] as the bridge.

            **IDENTITY RULE (THE "RELATABLE MENTOR" SHIFT):**
            You must shift your tone as the story progresses to build trust:
            - **AT THE START (Phase 1):** You are a **FRIEND**. Use vulnerable language ("Aku juga pernah...", "Rasanya capek ya...").
            - **IN THE MIDDLE (Phase 2):** You are an **ANALYST**. Use objective logic ("Masalahnya bukan di kamu, tapi di sistemnya...").
            - **AT THE END (Phase 3):** You are a **GUIDE**. Use confident authority ("Ada cara yang lebih baik...").
            
            *CRITICAL:* Never sound like a corporate brand. Sound like the Founder/Creator talking personally to their best friend.

            **RULES:**
            - LENGTH: Keep it "Snackable" (Max 120-130 words).
            - TONE: Vulnerable start -> Wise middle -> Hopeful end.
            - LANGUAGE: Natural "Curhat" style (e.g. Aku/Kamu). No marketing jargon.
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
