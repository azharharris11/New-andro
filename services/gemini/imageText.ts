
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
        case CreativeFormat.LONG_TEXT:
            return `${baseGuide}
            STYLE: Instagram Story "Wall of Text" Overlay.
            COPY STYLE: Long-form narrative (3-4 short  Sentences). jangan lupa call to action
            FONT: San Francisco (iOS) or Typewriter font dengan background text agar tulisan bisa terbaca Small/Medium size. with smart highlight (seperti stabilo) meng highligh tulisan hooknya yg membuat orang mau membaca sampai akhir 
            LAYOUT: Center-aligned or Left-aligned block text.
            BACKGROUND: sesuaikan photo background , 
            IDENTITY RULE: Follow the specific "Voice Archetype" defined in the prompt (Authority/Skeptic/Etc).`;

        case CreativeFormat.STORY_POLL:
            return `${baseGuide}
            STYLE: Direct Instagram Story Screenshot with Poll Sticker.
            COPY STYLE: Question must be engaging/provocative. Options should be binary (Yes/No, This/That).
            ELEMENTS: The Poll Question + Two Option Buttons.
            IDENTITY RULE: Question: Ask the AUDIENCE. Options: Audience Responses.`;

        case CreativeFormat.STORY_QNA:
            return `${baseGuide}
            STYLE: Direct Instagram Q&A Sticker Response (Flat UI).
            COPY STYLE: Question is a user complaint/worry. Answer is empathetic solution.
            LAYOUT: White "Question Box" above Answer Text.
            IDENTITY RULE: Question Box: CLIENT complaining. Answer Text: BRAND answering.`;

        case CreativeFormat.PHONE_NOTES:
            return `${baseGuide}
            STYLE: Direct Screenshot of Apple Notes App.
            COPY STYLE: Stream of consciousness, raw, vulnerable, diary-entry style.
            SURFACE: Textured yellowish paper digital background.
            HEADER: "Today at 9:41 AM".
            DYNAMIC: The text cursor "|" should be visible.
            IDENTITY RULE: TITLE: "Journal" or "Thoughts". BODY: Raw emotion.`;

        case CreativeFormat.TWITTER_REPOST:
            return `${baseGuide}
            STYLE: Direct Screenshot of X (Twitter) Post - DARK MODE.
            COPY STYLE: Internet slang, lowercase, abbreviations (rn, lol, smh), punchy.
            BACKGROUND: Pure Hex Black background (#000000).
            ELEMENTS: Profile Pic, Name, Handle (@user_123), Text, Stats.
            NO: No hand, no phone bezel. Just the UI.`;

        case CreativeFormat.HANDHELD_TWEET:
             return `${baseGuide}
             STYLE: Photograph of a hand holding a phone showing a Tweet.
             COPY STYLE: Slang, punchy.
             BACKGROUND: Blurred lifestyle background.
             FOCUS: The screen is the hero.`;
        
        case CreativeFormat.GMAIL_UX:
            return `${baseGuide}
            STYLE: Direct Screenshot of Gmail Mobile Inbox List.
            COPY STYLE: Subject line cut off (ellipsis...), sender name clear. Urgent or curiosity-inducing.
            ELEMENTS: Sender Name (Bold), Subject (Bold), Preview Text (Grey).
            IDENTITY RULE: Sender MUST be the Source of Pain or Authority.`;
        
        case CreativeFormat.DM_NOTIFICATION:
        case CreativeFormat.REMINDER_NOTIF:
            return `${baseGuide}
            STYLE: Direct Screenshot of iOS Lockscreen Notification Stack.
            COPY STYLE: Short, urgent, intimate. "Missed call", "Don't forget", "Hey...".
            SURFACE: Glassmorphism blur effect over a wallpaper.
            NO: No phone hardware visible. Just the screen UI.
            IDENTITY RULE: SENDER: "Him", "Her", "Crush", or "Reminder".`;
        
        case CreativeFormat.CHAT_CONVERSATION:
            return `${baseGuide}
            STYLE: Direct Screenshot of WhatsApp or iMessage.
            COPY STYLE: Conversational, short bursts. "P ing" "Where are you?"
            LAYOUT: Left (Incoming) vs Right (Outgoing).
            IDENTITY RULE: The complaint ALWAYS comes from the Left.`;
            
        case CreativeFormat.SEARCH_BAR:
            return `${baseGuide}
            STYLE: Direct Screenshot of Google Mobile Search Page.
            COPY STYLE: Query syntax. "how to fix...", "why is my...", "best cure for...".
            ELEMENTS: Search pill with text + Magnifying glass icon.
            IDENTITY RULE: The text represents the User's secret anxiety.`;

        case CreativeFormat.REDDIT_THREAD:
            return `${baseGuide}
            STYLE: Direct Screenshot of Reddit Post - Dark Mode.
            COPY STYLE: Forum title style. "AITA for...", "TIFU by...", "Does anyone else...".
            ELEMENTS: Subreddit name (r/...), Upvote arrow, Title.
            IDENTITY RULE: User is anonymous. Brand is NOT the OP.`;

        case CreativeFormat.SOCIAL_COMMENT_STACK:
            return `${baseGuide}
            STYLE: Direct Screenshot of Instagram/TikTok Comments Section.
            COPY STYLE: Internet comment slang. "Real.", "This.", "Omg same 😭".
            ELEMENTS: Stack of 3-4 comments.
            IDENTITY RULE: Netizens validating the problem.`;
            
        case CreativeFormat.REELS_THUMBNAIL:
            return `${baseGuide}
            STYLE: Instagram Reels Cover (9:16) Screenshot.
            COPY STYLE: Clickbait Hook. "Stop doing this", "3 Reasons why", "Watch till end".
            TEXT: Big, Bold Hook Text.
            IDENTITY RULE: Visual matches the hook intensity.`;

        // ============================================================
        // GROUP 2: VISUAL & CREATOR FORMATS (Authenticity Focus)
        // ============================================================

        case CreativeFormat.UGC_MIRROR:
            return `${baseGuide}
            STYLE: Mirror Selfie Photograph.
            COPY STYLE: Text bubble overlay. Casual observation. "Outfit of the day", "Gym progress".
            SUBJECT: Gen-Z/Millennial creator holding a smartphone.
            IDENTITY RULE: Must look like a customer review.`;

        case CreativeFormat.EDUCATIONAL_RANT:
            return `${baseGuide}
            STYLE: Talking Head Video Screenshot (Green Screen).
            COPY STYLE: Educational hook/headline overlay. "The Truth About X".
            BACKGROUND: Relevant article/photo.
            IDENTITY RULE: Caption is a "Truth Bomb".`;
            
        case CreativeFormat.WHITEBOARD:
            return `${baseGuide}
            STYLE: Hand-drawn diagram on a whiteboard/paper.
            COPY STYLE: Handwritten notes, arrows, circles. Simple concepts.
            TEXT: Handwriting font (Marker style).
            IDENTITY RULE: Teacher/Explainer mode.`;

        case CreativeFormat.MEME:
            return `${baseGuide}
            STYLE: Modern Meme (Twitter screenshot or Top Text).
            COPY STYLE: Relatable situation. "Me when...", "Nobody: ...".
            FONT: Standard Sans-serif or Impact.
            IDENTITY RULE: Audience perspective.`;
            
        case CreativeFormat.COLLAGE_SCRAPBOOK:
            return `${baseGuide}
            STYLE: Digital Scrapbook / Moodboard.
            COPY STYLE: Handwritten labels, dates, "Mood", "Vibe".
            ELEMENTS: Ripped paper, tape.
            IDENTITY RULE: Aesthetic/Vision board.`;

        // ============================================================
        // GROUP 3: PATTERN INTERRUPT & UGLY ADS (Raw/Lo-Fi)
        // ============================================================
        
        case CreativeFormat.UGLY_VISUAL:
        case CreativeFormat.MS_PAINT:
             return `${baseGuide}
             STYLE: MS Paint Scribble / Bad Graphic Design.
             COPY STYLE: Crude, ironic, simple. "Graphic design is my passion" energy.
             BACKGROUND: Plain white canvas.
             FONT: Comic Sans, Arial.
             VIBE: Ironic, stands out.`;

        case CreativeFormat.STICKY_NOTE_REALISM:
             return `${baseGuide}
             STYLE: Real Post-it note Photograph.
             COPY STYLE: Handwritten reminder. Short, punchy. "Drink water", "Call mom".
             FONT: Messy Handwriting.
             IDENTITY RULE: Personal reminder.`;
             
        case CreativeFormat.BIG_FONT:
        case CreativeFormat.BILLBOARD:
            return `${baseGuide}
            STYLE: Kinetic Typography / Poster.
            COPY STYLE: 3-5 Words Max. Loud. Shocking.
            BACKGROUND: Solid color.
            FONT: HUGE Impact/Helvetica.
            IDENTITY RULE: Loud Announcement.`;

        // ============================================================
        // GROUP 4: DATA, LOGIC & CONVERSION (Trust Signals)
        // ============================================================
        
        case CreativeFormat.US_VS_THEM:
            return `${baseGuide}
            STYLE: Digital Comparison Chart (Infographic).
            COPY STYLE: "Us" vs "Them" labels. Feature list.
            ICONS: Checkmarks vs Crosses.
            IDENTITY RULE: Brand = Winner.`;

        case CreativeFormat.BEFORE_AFTER:
        case CreativeFormat.OLD_ME_VS_NEW_ME:
            return `${baseGuide}
            STYLE: Split Screen Photo.
            COPY STYLE: Time labels. "Day 1" vs "Day 30". "Before" vs "After".
            VISUAL: Left desaturated, Right bright.
            IDENTITY RULE: Transformation proof.`;
            
        case CreativeFormat.TIMELINE_JOURNEY:
             return `${baseGuide}
             STYLE: Roadmap / Timeline Infographic.
             COPY STYLE: Steps/Milestones. "Start", "Process", "Goal".
             POINTS: A -> B -> C.
             IDENTITY RULE: The Path.`;

        case CreativeFormat.CHECKLIST_TODO:
            return `${baseGuide}
            STYLE: Notebook Checklist Photograph.
            COPY STYLE: List items. "Pain 1", "Pain 2".
            ELEMENTS: Handwritten checkboxes.
            IDENTITY RULE: Symptom checklist.`;

        case CreativeFormat.TESTIMONIAL_HIGHLIGHT:
        case CreativeFormat.CAROUSEL_TESTIMONIAL:
            return `${baseGuide}
            STYLE: Review Block / Trustpilot Card (Digital UI).
            COPY STYLE: Customer quote. "Best investment ever", "Finally relieved".
            ELEMENTS: 5 Gold Stars.
            IDENTITY RULE: Social proof.`;
            
        case CreativeFormat.PRESS_FEATURE:
            return `${baseGuide}
            STYLE: News Headline Overlay.
            COPY STYLE: Journalistic headline. "The breakthrough of 2024".
            LOGO: Generic "News" logo.
            IDENTITY RULE: Authority.`;
            
        case CreativeFormat.GRAPH_CHART:
        case CreativeFormat.VENN_DIAGRAM:
             return `${baseGuide}
             STYLE: Chart/Graph Infographic.
             COPY STYLE: Data labels. Axis labels. "Efficiency", "Cost".
             IDENTITY RULE: Logic and Facts.`;

        // ============================================================
        // DEFAULTS & FALLBACKS
        // ============================================================
        
        default:
            return `${baseGuide}
            STYLE: Natural Text Overlay.
            COPY STYLE: Short, readable headline.
            LAYOUT: Integrated.
            IDENTITY RULE: Observer/Expert.`;
    }
};
