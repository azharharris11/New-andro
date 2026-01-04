import { CreativeFormat } from "../../types";

/**
 * SOURCE OF TRUTH FOR NATIVE TEXT RENDERING STYLES (Nano Banana Pro).
 * Refined for Realism, Platform Accuracy, Brand Safety, and Dynamic Layouts.
 */
export const getFormatTextGuide = (format: CreativeFormat): string => {
    const baseGuide = "TEXT RENDERING INSTRUCTION:";
    
    switch (format) {
        // ============================================================
        // GROUP 1: NATIVE SOCIAL UI (High Fidelity & Identity Safe)
        // ============================================================
        
        case CreativeFormat.IG_STORY_TEXT:
            return `${baseGuide}
            STYLE: Instagram Story Overlay.
            FONT: San Francisco (iOS) or Modern Sans-serif. White text with black semi-transparent background blocks (classic IG style).
            LAYOUT: Center-aligned or Left-aligned.
            SAFE ZONE: Keep text in the CENTER area. AVOID the very top (Profile bar) and very bottom (Reply bar).
            DYNAMIC: Slightly tilted text or "Sticker" placement to look candid/hand-edited.
            IDENTITY RULE: 
             - Perspective: "Observer" ("Do you feel this?") or "Past Self" ("I used to...").
             - NEVER present the Brand as currently suffering.
            VIBE: Casual, "Curhat" style but Authoritative.`;

        case CreativeFormat.STORY_POLL:
            return `${baseGuide}
            STYLE: Instagram Story Poll Sticker.
            ELEMENTS: The Poll Question + Two Option Buttons (Standard IG UI).
            IDENTITY RULE: 
             - Question: Ask the AUDIENCE (e.g. "Tim susah tidur?").
             - Options: Audience Responses (e.g. "Iya 😭" / "Gak").
             - DO NOT make the brand ask for help.`;

        case CreativeFormat.STORY_QNA:
            return `${baseGuide}
            STYLE: Instagram Q&A Sticker Response.
            LAYOUT: A white "Question Box" (Source: Follower) placed above the Answer Text.
            VISUAL DETAIL: The Question Box should have a small profile picture circle.
            IDENTITY RULE: 
             - Question Box: CLIENT complaining/asking (e.g. "Kak, rasanya hampa...").
             - Answer Text: BRAND answering with empathy.`;

        case CreativeFormat.PHONE_NOTES:
            return `${baseGuide}
            STYLE: Apple Notes App UI.
            SURFACE: Textured yellowish paper background.
            HEADER: "Today at 9:41 AM" (Standard iOS timestamp).
            DYNAMIC: The text cursor "|" should be visible at the end to imply typing.
            IDENTITY RULE:
             - TITLE: Must be "Journal", "Self-Reflection", or "Client Notes".
             - BODY: Emotional/Raw text.
            ADDITION: A hand-drawn Red Circle or Arrow highlighting the most painful sentence.`;

        case CreativeFormat.TWITTER_REPOST:
        case CreativeFormat.HANDHELD_TWEET:
            return `${baseGuide}
            STYLE: X (Twitter) Post UI - DARK MODE.
            BACKGROUND: Dark/Black background (Higher contrast/readability).
            ELEMENTS: Profile Pic, Name, Handle, Text, and Engagement Stats (Likes/Retweets).
            IDENTITY RULE: 
             - IF Complaint: Handle must be "Anonymous" (e.g. @sad_girl).
             - IF Tips: Handle is Brand.
            VIBE: Viral tweet screenshot.`;
        
        case CreativeFormat.GMAIL_UX:
            return `${baseGuide}
            STYLE: Gmail Mobile Inbox List.
            ELEMENTS: Sender Name (Bold), Subject (Bold), Preview Text (Grey).
            IDENTITY RULE: Sender MUST be the Source of Pain (e.g. "Ex-Boyfriend", "Boss", "Bank") or a Higher Power ("Universe").
            FONT: Roboto/Product Sans.`;
        
        case CreativeFormat.DM_NOTIFICATION:
        case CreativeFormat.REMINDER_NOTIF:
            return `${baseGuide}
            STYLE: iOS Lockscreen Notification Stack.
            SURFACE: Glassmorphism blur effect over a wallpaper.
            IDENTITY RULE: 
             - SENDER: "Him", "Her", "Crush", or "Reminder".
             - MESSAGE: The triggering text.
            VIBE: Urgent, personal, "Look at your phone" moment.`;
        
        case CreativeFormat.CHAT_CONVERSATION:
            return `${baseGuide}
            STYLE: WhatsApp (Green Bubbles) OR iMessage (Blue Bubbles).
            LAYOUT: 
             - LEFT (White/Grey): Incoming message (The Client/Victim).
             - RIGHT (Green/Blue): Outgoing message (The Brand/Healer).
            DETAILS: Add "Read" checks (Blue ticks) to show the message was seen.
            IDENTITY RULE: The complaint ALWAYS comes from the Left.`;
            
        case CreativeFormat.SEARCH_BAR:
            return `${baseGuide}
            STYLE: Google Mobile Search Page.
            ELEMENTS: Search pill with text + Magnifying glass icon.
            BELOW BAR: 2-3 "Dropdown Suggestions" that relate to the problem.
            IDENTITY RULE: The text represents the User's secret anxiety (e.g. "ciri ciri jodoh tertutup").`;

        case CreativeFormat.REDDIT_THREAD:
            return `${baseGuide}
            STYLE: Reddit Post - Dark Mode.
            ELEMENTS: Subreddit name (e.g. r/relationship_advice), Upvote arrow, Title.
            IDENTITY RULE: User is u/Throwaway_123. Brand is NOT the OP.`;

        case CreativeFormat.SOCIAL_COMMENT_STACK:
            return `${baseGuide}
            STYLE: Instagram/TikTok Comments Section.
            ELEMENTS: Stack of 3-4 comments with different avatars.
            IDENTITY RULE: These are "Netizens" validating the problem (Social Proof). e.g. "Relate banget kak 😭".`;
            
        case CreativeFormat.REELS_THUMBNAIL:
            return `${baseGuide}
            STYLE: Instagram Reels Cover (9:16).
            TEXT: Big, Bold Hook Text in the center or top-third.
            IDENTITY RULE:
             - IF Title "POV: [Pain]" -> Visual: Sad person.
             - IF Title "Solution" -> Visual: Confident expert.`;

        // ============================================================
        // GROUP 2: VISUAL & CREATOR FORMATS (Authenticity Focus)
        // ============================================================

        case CreativeFormat.UGC_MIRROR:
            return `${baseGuide}
            STYLE: Mirror Selfie.
            SUBJECT: Gen-Z/Millennial creator holding a smartphone.
            OVERLAY: Text bubble or standard story text.
            IDENTITY RULE: "POV" text style. Must look like a customer review.`;

        case CreativeFormat.EDUCATIONAL_RANT:
            return `${baseGuide}
            STYLE: Talking Head Video Screenshot (Green Screen style).
            BACKGROUND: A relevant news article, chart, or photo behind the person.
            SUBJECT: Expert looking directly at camera.
            IDENTITY RULE: Caption is a "Truth Bomb" or Educational hook.`;
            
        case CreativeFormat.WHITEBOARD:
            return `${baseGuide}
            STYLE: Hand-drawn diagram on a whiteboard/paper.
            TEXT: Handwriting font (Marker style).
            IDENTITY RULE: You are the Teacher explaining a concept.`;

        case CreativeFormat.MEME:
            return `${baseGuide}
            STYLE: Modern Meme (Twitter screenshot or Text above image).
            FONT: Standard Sans-serif or Impact.
            IDENTITY RULE: "Me when..." / "That feeling when..." (Audience perspective).`;
            
        case CreativeFormat.COLLAGE_SCRAPBOOK:
            return `${baseGuide}
            STYLE: Digital Scrapbook / Moodboard.
            ELEMENTS: Ripped paper edges, tape textures, polaroid frames.
            IDENTITY RULE: "Vision Board" or "Current Mood" aesthetic.`;

        // ============================================================
        // GROUP 3: PATTERN INTERRUPT & UGLY ADS (Raw/Lo-Fi)
        // ============================================================
        
        case CreativeFormat.UGLY_VISUAL:
        case CreativeFormat.MS_PAINT:
             return `${baseGuide}
             STYLE: MS Paint Scribble / Bad Graphic Design.
             BACKGROUND: Plain white canvas.
             FONT: Comic Sans, Arial, or pixellated brush.
             COLORS: Neon Green, Red, or bright primary colors.
             VIBE: "Graphic design is my passion" irony. Stands out because it's ugly.`;

        case CreativeFormat.STICKY_NOTE_REALISM:
             return `${baseGuide}
             STYLE: Real Post-it note stuck on a monitor or desk.
             FONT: Messy Handwriting (Sharpie style).
             LIGHTING: Slightly uneven/natural lighting (not perfect studio light).
             IDENTITY RULE: A personal reminder or affirmation.`;
             
        case CreativeFormat.BIG_FONT:
        case CreativeFormat.BILLBOARD:
            return `${baseGuide}
            STYLE: Kinetic Typography / Poster.
            BACKGROUND: Solid Yellow, Black, or Red.
            FONT: HUGE Impact or Helvetica Bold.
            LAYOUT: Text fills 90% of the frame. Margins are tight (Bleed effect).
            IDENTITY RULE: Loud Announcement.`;

        // ============================================================
        // GROUP 4: DATA, LOGIC & CONVERSION (Trust Signals)
        // ============================================================
        
        case CreativeFormat.US_VS_THEM:
            return `${baseGuide}
            STYLE: Comparison Chart.
            ICONS: Green Checkmarks (✅) vs Red Crosses (❌).
            LAYOUT: Two columns.
            IDENTITY RULE: "Us" = Brand (Winner). "Them" = Old Way (Loser).`;

        case CreativeFormat.BEFORE_AFTER:
        case CreativeFormat.OLD_ME_VS_NEW_ME:
            return `${baseGuide}
            STYLE: Split Screen.
            LABELS: "Dulu (Stuck)" [Left] vs "Sekarang (Lega)" [Right].
            VISUAL: Left side desaturated/gloomy. Right side bright/happy.
            IDENTITY RULE: Show the Transformation.`;
            
        case CreativeFormat.TIMELINE_JOURNEY:
             return `${baseGuide}
             STYLE: Roadmap / Timeline Line.
             POINTS: Point A (Pain) --> Point B (Process) --> Point C (Goal).
             IDENTITY RULE: "The Path to Healing".`;

        case CreativeFormat.CHECKLIST_TODO:
            return `${baseGuide}
            STYLE: Notebook Checklist.
            ELEMENTS: Handwritten checkboxes.
            MARKS: Some checked, some circled in red.
            IDENTITY RULE: "Gejala yang aku rasakan" (Symptoms) OR "Steps to Fix It" (Plan).`;

        case CreativeFormat.TESTIMONIAL_HIGHLIGHT:
        case CreativeFormat.CAROUSEL_TESTIMONIAL:
            return `${baseGuide}
            STYLE: Review Block / Trustpilot Card.
            ELEMENTS: 5 Gold Stars ⭐⭐⭐⭐⭐.
            TEXT: The review text + Client Name.
            IDENTITY RULE: Authentic social proof.`;
            
        case CreativeFormat.PRESS_FEATURE:
            return `${baseGuide}
            STYLE: News Headline Overlay.
            LOGO: A generic "News" or "Magazine" logo at top.
            FONT: Serif Editorial Font.
            IDENTITY RULE: Third-party validation.`;
            
        case CreativeFormat.GRAPH_CHART:
        case CreativeFormat.VENN_DIAGRAM:
             return `${baseGuide}
             STYLE: Hand-drawn Chart on Napkin/Paper OR Clean Vector Chart.
             IDENTITY RULE: Logic and Facts. No emotions, just data.`;

        // ============================================================
        // DEFAULTS & FALLBACKS
        // ============================================================
        
        default:
            return `${baseGuide}
            STYLE: Natural Text Overlay.
            LAYOUT: Adapt to the scene. If subject is right, text is left (Negative Space).
            DEPTH: Text should appear integrated, possibly behind small foreground elements.
            IDENTITY RULE: Default to "Observer" or "Expert" mode. Never "Victim".`;
    }
};