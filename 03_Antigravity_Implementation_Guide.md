# Antigravity Implementation Guide
## Building ThePlot with Google Antigravity

---

## Document Control
- **Version:** 1.0
- **Date:** February 11, 2026
- **Target:** Google Antigravity 1.0 Public Preview
- **Estimated Time:** 48-72 hours

---

## 1. Prerequisites

### 1.1 System Requirements
- **OS:** macOS, Windows, or Linux
- **RAM:** 16GB recommended (8GB minimum)
- **Disk Space:** 5GB free
- **Internet:** Stable connection for AI model access

### 1.2 Required Accounts
- [ ] Google Account (for Antigravity)
- [ ] Anthropic Account (Claude API access)
- [ ] Supabase Account (database & realtime)
- [ ] Vercel Account (deployment)
- [ ] GitHub Account (version control)

### 1.3 Software Setup
```bash
# Install Node.js 20+ (if not already installed)
# macOS (using Homebrew)
brew install node@20

# Verify installation
node --version  # Should be v20.x.x
npm --version   # Should be v10.x.x

# Install pnpm (faster than npm)
npm install -g pnpm
```

---

## 2. Antigravity Installation & Setup

### 2.1 Download and Install

1. **Download Antigravity:**
   - Visit: https://antigravity.google/
   - Click "Download for [Your OS]"
   - Current version: 1.0 Public Preview

2. **Install:**
   - **macOS:** Open .dmg file, drag to Applications
   - **Windows:** Run .exe installer
   - **Linux:** Extract .tar.gz and run install.sh

3. **First Launch:**
   - Open Antigravity
   - Sign in with Google account
   - Choose "Start fresh" setup

### 2.2 Initial Configuration

#### Development Mode Selection
```
Recommended Setup:
✓ Agent-assisted development (balanced control)
✓ Terminal Policy: Request review
✓ Auto-execute: Safe commands only
```

#### Model Selection
```
Primary Model: Gemini 3 Pro (free tier)
Fallback: Claude Sonnet 4.5 (if available)
```

#### Theme
```
✓ Dark theme (matches terminal aesthetic)
```

### 2.3 Create Project Workspace

1. **Create Project Folder:**
```bash
mkdir ~/theplot
cd ~/theplot
```

2. **Open in Antigravity:**
   - File → Open Folder
   - Select `~/theplot`
   - Click "Open"

3. **Initialize Git:**
```bash
git init
git add .
git commit -m "Initial commit"
```

---

## 3. Project Setup with Antigravity

### 3.1 Initialize Next.js Project

**Antigravity Prompt:**
```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and App Router.

Setup requirements:
- Use pnpm as package manager
- Enable TypeScript strict mode
- Configure Tailwind with dark mode support
- Set up ESLint and Prettier
- Create .env.local template file

Project name: theplot
```

**Expected Artifacts:**
- Task Plan showing setup steps
- Implementation Plan with file structure
- Completed Next.js project scaffold

**Review Checklist:**
- [ ] `package.json` has correct dependencies
- [ ] `tsconfig.json` has strict mode enabled
- [ ] `tailwind.config.ts` configured
- [ ] `.env.local.template` created

### 3.2 Install Dependencies

**Antigravity Prompt:**
```
Install the following dependencies for ThePlot:

Required packages:
- @anthropic-ai/sdk (Claude API)
- @supabase/supabase-js (Supabase client)
- framer-motion (animations)
- qrcode (QR code generation)
- zod (validation)
- lru-cache (rate limiting)

Dev dependencies:
- @types/node
- @types/qrcode

Use pnpm install.
```

**Verify Installation:**
```bash
pnpm list | grep anthropic
pnpm list | grep supabase
```

### 3.3 Create Project Structure

**Antigravity Prompt:**
```
Create the following directory structure for ThePlot:

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing page)
│   ├── session/[id]/page.tsx
│   └── api/
│       ├── session/create/route.ts
│       ├── session/join/route.ts
│       ├── session/answer/route.ts
│       └── simulate/route.ts
├── components/
│   ├── landing/
│   ├── session/
│   ├── questions/
│   ├── simulation/
│   └── results/
├── lib/
│   ├── supabase.ts
│   ├── anthropic.ts
│   ├── simulation.ts
│   ├── questions.ts
│   └── validation.ts
├── hooks/
│   ├── useSession.ts
│   ├── useRealtime.ts
│   └── useSimulation.ts
└── types/
    └── index.ts

Create placeholder files with TypeScript interfaces where appropriate.
```

---

## 4. Core Feature Implementation

### 4.1 Supabase Setup

**Manual Step:** Create Supabase Project
1. Go to https://supabase.com
2. Create new project: "theplot"
3. Note: Project URL and API keys

**Antigravity Prompt:**
```
Create a Supabase client setup in lib/supabase.ts.

Requirements:
- Import createClient from @supabase/supabase-js
- Use environment variables for URL and keys
- Export configured client
- Add TypeScript types for session data

Environment variables needed:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Create Supabase Schema:**

Run this SQL in Supabase SQL Editor:
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 minutes',
  status TEXT NOT NULL DEFAULT 'waiting',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'active', 'completed', 'expired'))
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;

-- Auto-delete function
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
SELECT cron.schedule('cleanup-sessions', '*/5 * * * *', 'SELECT delete_expired_sessions()');
```

### 4.2 Question System

**Antigravity Prompt:**
```
Create a question bank system in lib/questions.ts.

Requirements:
- Define 3 questions (communication, values, challenges)
- Each question has: id, text, options (4 choices)
- Export typed Question interface
- Export getQuestions() function

Example question:
{
  id: 'q1',
  text: 'When stressed, I tend to:',
  options: ['Talk it out', 'Need alone time', 'Get irritable', 'Stay calm']
}
```

**Antigravity Prompt:**
```
Create a QuestionFlow component in components/questions/QuestionFlow.tsx.

Features:
- Display one question at a time
- Progress indicator (1/3, 2/3, 3/3)
- Store answers in local state
- Call onComplete callback when all answered
- Mobile-responsive design with large touch targets

Use Tailwind for styling. Terminal/cyberpunk aesthetic.
```

### 4.3 Session Management

**Antigravity Prompt:**
```
Create /api/session/create endpoint that:

1. Generates UUID for session
2. Creates session record in Supabase
3. Generates QR code URL
4. Returns sessionId and QR code data URL

Use the qrcode package for QR generation.
Include error handling and logging.
```

**Antigravity Prompt:**
```
Create /api/session/join endpoint that:

1. Accepts sessionId and userId in request body
2. Updates session in Supabase to add User B
3. Returns success + session data
4. Handles errors (session not found, expired, already full)
```

**Antigravity Prompt:**
```
Create useRealtime hook in hooks/useRealtime.ts.

Functionality:
- Subscribe to Supabase realtime changes for specific session
- Update local state when session changes
- Clean up subscription on unmount
- Return current session data

Use Supabase realtime channels.
```

### 4.4 AI Simulation Engine

**Antigravity Prompt:**
```
Create Claude API wrapper in lib/anthropic.ts.

Requirements:
- Import Anthropic SDK
- Create client with API key from env
- Export runSimulation function that:
  - Takes userA and userB personality data
  - Calls Claude with system prompt
  - Parses JSON response
  - Returns SimulationResult

Use Claude Sonnet 4.5 model.
Handle API errors gracefully.
```

**Antigravity Prompt:**
```
Create simulation logic in lib/simulation.ts.

Core function: buildPersonality(answers: Answer[]): string

This should:
- Map question answers to personality traits
- Create a text description of the person
- Return formatted string for AI prompt

Example output:
"Communication Style: Talk it out
Core Value: Trust  
Conflict Response: Be hurt but talk about it"
```

**Antigravity Prompt:**
```
Create /api/simulate endpoint.

Workflow:
1. Receive userA and userB data from request
2. Build personality descriptions
3. Call Claude API with simulation prompt
4. Parse response (7-year timeline)
5. Calculate emotional metrics
6. Update session in Supabase with results
7. Return simulation data

System prompt should:
- Define 7-year timeline structure
- Require 3-5 events per year
- Track emotional states (trust, satisfaction, commitment)
- Enforce 70% positive outcome bias
- Avoid traumatic scenarios
- Output JSON format

Include extensive error handling.
```

### 4.5 Terminal UI

**Antigravity Prompt:**
```
Create Terminal component in components/simulation/Terminal.tsx.

Features:
- Full-screen terminal aesthetic
- Matrix-style scrolling text (green on black)
- Year counter that increments every 8 seconds
- Display 3-5 events per year
- Dramatic pauses on critical events (2-3 seconds)
- Emotional metrics sidebar (trust, satisfaction, commitment bars)
- Skip button (bottom-right, subtle)

Use Framer Motion for animations:
- Text fade-in with typing effect
- Number increment animations
- Progress bar smooth transitions

Mobile-responsive: Stack vertically on small screens.
```

**Antigravity Prompt:**
```
Create EventDisplay sub-component.

This should:
- Receive array of event strings
- Display them with typewriter effect
- Pause on "critical" events (marked with **CRITICAL** in text)
- Use monospace font (Courier New or IBM Plex Mono)
- Green text (#00FF00) on black background

Use react-type-animation or custom implementation.
```

### 4.6 Results Screen

**Antigravity Prompt:**
```
Create Results component in components/results/OutcomeDisplay.tsx.

Layout:
1. Large outcome headline (e.g., "Still Together: Strong Foundation")
2. Timeline cards (7 cards, one per year)
3. Insights section (3-5 bullet points)
4. Share buttons (Twitter, Instagram, Copy Link)
5. Mental health resources (always visible)

Styling:
- Terminal aesthetic consistent with simulation
- Cards with subtle glow effect
- Responsive grid layout
- Accessibility: proper heading hierarchy

Include social media share functionality.
```

### 4.7 Landing Page

**Antigravity Prompt:**
```
Create landing page in app/page.tsx.

Sections:
1. Hero:
   - Bold headline: "What's Your Plot?"
   - Subheadline: "AI-powered relationship simulation"
   - CTA: "Start Simulation" button
   - Background: Subtle matrix rain animation

2. How It Works (3 steps):
   - Step 1: Both scan QR code
   - Step 2: Answer 3 questions
   - Step 3: Watch your future unfold

3. Disclaimer (prominent):
   - Entertainment only
   - Not real prediction
   - Links to mental health resources

4. Footer:
   - Privacy policy
   - About
   - Contact

Use Tailwind CSS. Terminal/cyberpunk aesthetic. Mobile-first design.
```

---

## 5. Styling & Theming

### 5.1 Tailwind Configuration

**Antigravity Prompt:**
```
Update tailwind.config.ts with ThePlot theme.

Add custom colors:
- matrix: #00FF00 (primary green)
- amber: #FF9500 (secondary)
- terminal-bg: #000000
- terminal-glow: rgba(0, 255, 0, 0.2)

Add custom fonts:
- mono: ['IBM Plex Mono', 'Courier New', monospace]

Add custom animations:
- blink: cursor blink for terminal
- glow-pulse: subtle glow effect
- matrix-rain: falling text animation

Extend with custom utility classes as needed.
```

### 5.2 Global Styles

**Antigravity Prompt:**
```
Create app/globals.css with:

1. CSS reset and base styles
2. Terminal aesthetic utilities
3. Matrix rain animation keyframes
4. Glow effects for terminal text
5. Responsive typography scale
6. Focus states for accessibility

Use CSS custom properties for theming.
```

---

## 6. Testing & Validation

### 6.1 Unit Tests

**Antigravity Prompt:**
```
Create unit tests for:

1. lib/simulation.ts:
   - buildPersonality() returns correct format
   - calculateMetrics() bounds values 0-100

2. lib/validation.ts:
   - Schema validation catches invalid inputs
   - Sanitization works correctly

Use Jest and @testing-library/react.
Place tests in __tests__/ directory.
```

### 6.2 Integration Testing

**Antigravity Prompt:**
```
Create integration test for full session flow:

1. User A creates session
2. User B joins session
3. Both submit answers
4. Simulation runs successfully
5. Results displayed correctly

Mock Supabase and Anthropic API calls.
Use MSW (Mock Service Worker) for API mocking.
```

### 6.3 Manual Testing Checklist

**Test on Antigravity Browser Preview:**
- [ ] Landing page loads correctly
- [ ] QR code displays and is scannable
- [ ] Questions display and accept input
- [ ] Terminal animation runs smoothly
- [ ] Results page shows correct data
- [ ] Mobile responsive on iPhone/Android
- [ ] Disclaimers always visible
- [ ] Mental health links work

---

## 7. Deployment Preparation

### 7.1 Environment Variables Setup

**Create `.env.local`:**
```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

**Antigravity Prompt:**
```
Create .env.local.template file with placeholder values.
Add .env.local to .gitignore.
Create README section explaining how to set up environment variables.
```

### 7.2 Vercel Deployment

**Antigravity Prompt:**
```
Create vercel.json configuration file.

Include:
- Framework: Next.js
- Region: iad1 (US East)
- Environment variable references
- Security headers (CSP, X-Frame-Options, etc.)
- Cache headers for static assets
```

**Manual Steps:**
1. Install Vercel CLI: `pnpm add -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### 7.3 Pre-Launch Checklist

**Antigravity Prompt:**
```
Create a pre-launch checklist markdown file.

Include checks for:
- All features working in production
- Environment variables set correctly
- Supabase realtime enabled
- Anthropic API key valid and funded
- Rate limiting configured
- Analytics tracking active
- Error monitoring (Sentry) configured
- Mobile testing completed
- Accessibility testing passed
- Security headers verified
- Performance metrics acceptable
```

---

## 8. Antigravity-Specific Workflows

### 8.1 Using Agent Manager

**For Complex Features:**
1. Open Agent Manager (Cmd+Shift+M)
2. Create new task: "Implement real-time sync for ThePlot sessions"
3. Let agent create plan
4. Review plan artifacts
5. Approve and let agent execute
6. Review code and test

**For Quick Fixes:**
1. Use inline chat (Cmd+I)
2. Describe issue
3. Agent suggests fix
4. Accept or modify

### 8.2 Custom Skills for ThePlot

**Create `.antigravity/skills/theplot.md`:**

```markdown
# ThePlot Development Skills

## Simulation Prompt Engineering
When creating AI simulation prompts:
- Always enforce 70% positive outcome bias
- Never generate traumatic scenarios (abuse, severe harm)
- Limit each year to 3-5 major events
- Track emotional metrics: trust, satisfaction, commitment
- Output JSON format only

## Real-time Synchronization
When implementing real-time features:
- Use Supabase Realtime channels
- Handle reconnection gracefully
- Show connection status to users
- Clean up subscriptions on unmount
- Test with 2+ devices simultaneously

## Terminal UI Patterns
When building terminal components:
- Use monospace fonts (IBM Plex Mono preferred)
- Green (#00FF00) or amber (#FF9500) text on black
- Typewriter effect for text reveal
- Dramatic pauses on critical moments
- Mobile: reduce animation intensity

## Safety & Ethics
Always include:
- Prominent disclaimer on all pages
- Mental health resources visible
- No storage of user data
- Positive outcome bias in AI responses
- Age verification (18+)
```

### 8.3 Debugging with Antigravity

**Enable verbose logging:**
```
Antigravity Settings → Terminal → Log Level → Verbose
```

**View agent reasoning:**
```
Agent Manager → Task Details → Reasoning Tab
```

**Inspect artifacts:**
```
Agent Manager → Artifacts Panel
```

---

## 9. Common Antigravity Commands

### 9.1 Terminal Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Check TypeScript errors
pnpm type-check

# Format code
pnpm format

# Lint code
pnpm lint
```

### 9.2 Antigravity Keyboard Shortcuts

- **Cmd+Shift+M** - Open Agent Manager
- **Cmd+I** - Inline chat
- **Cmd+Shift+P** - Command palette
- **Cmd+/** - Toggle terminal
- **Cmd+B** - Toggle sidebar
- **Cmd+Shift+F** - Search across files

### 9.3 Useful Antigravity Prompts

**Quick Component Generation:**
```
"Create a React component called [Name] that [description]. Use TypeScript, Tailwind CSS, and follow ThePlot design system."
```

**API Route Creation:**
```
"Create a Next.js API route at /api/[endpoint] that [description]. Include error handling, validation using Zod, and logging."
```

**Bug Fixing:**
```
"There's a bug where [description]. The expected behavior is [expected]. The actual behavior is [actual]. Please fix."
```

**Refactoring:**
```
"Refactor [file/component] to improve [performance/readability/maintainability]. Follow ThePlot code style guidelines."
```

---

## 10. Development Timeline

### Day 1 (8 hours): Foundation
- [x] Install Antigravity and dependencies
- [x] Initialize Next.js project
- [x] Set up Supabase and create schema
- [x] Create project structure
- [x] Implement question system
- [x] Build basic landing page

**Antigravity Agent Tasks:**
- Task 1: "Set up Next.js project with TypeScript and Tailwind"
- Task 2: "Create Supabase client and session management"
- Task 3: "Build question bank and QuestionFlow component"

### Day 2 (8 hours): Core Features
- [x] Implement session creation/join
- [x] Build real-time synchronization
- [x] Integrate Claude API
- [x] Create simulation engine
- [x] Develop terminal UI

**Antigravity Agent Tasks:**
- Task 4: "Implement session API routes and real-time sync"
- Task 5: "Build AI simulation engine with Claude integration"
- Task 6: "Create Terminal component with animations"

### Day 3 (8 hours): Polish & Deploy
- [x] Build results screen
- [x] Add social sharing
- [x] Implement safety features (disclaimers, resources)
- [x] Testing and bug fixes
- [x] Deploy to Vercel
- [x] Launch monitoring

**Antigravity Agent Tasks:**
- Task 7: "Complete results screen and sharing functionality"
- Task 8: "Add all safety disclaimers and mental health resources"
- Task 9: "Run full test suite and fix critical bugs"
- Task 10: "Deploy to Vercel and verify production"

---

## 11. Troubleshooting Guide

### Common Issues

#### Issue: Antigravity agent not responding
**Solution:**
- Check internet connection
- Verify API quota (Gemini 3 Pro free tier limits)
- Restart Antigravity
- Try switching to different model

#### Issue: Real-time sync not working
**Solution:**
- Verify Supabase Realtime is enabled for table
- Check subscription setup in code
- Ensure both clients connected to same channel
- Check browser console for WebSocket errors

#### Issue: Claude API errors
**Solution:**
- Verify API key is valid
- Check API usage limits
- Ensure correct model name in code
- Add retry logic with exponential backoff

#### Issue: Simulation taking too long
**Solution:**
- Reduce max_tokens in Claude API call
- Simplify simulation prompt
- Add timeout (30 seconds max)
- Show loading indicator to users

#### Issue: Mobile UI broken
**Solution:**
- Test in Antigravity mobile preview
- Check Tailwind responsive classes (sm:, md:, lg:)
- Verify touch targets are 44px minimum
- Test on real devices (iOS Safari, Android Chrome)

---

## 12. Next Steps After MVP

### Phase 2 Features (Week 2)

**Antigravity Prompt for Phase 2:**
```
Add interactive intervention mode to ThePlot.

New feature:
- During simulation, users can click "PAUSE" when conflict event appears
- Both users answer scenario question separately
- If answers show high compatibility, simulation continues positively
- If answers diverge, simulation reflects this

Update Terminal component to:
- Detect critical events
- Show PAUSE button
- Display scenario question
- Wait for both users to answer
- Resume simulation with adjusted trajectory
```

### Long-term Roadmap

1. **Educational Mode** - Partner with relationship therapists
2. **Extended Timeline** - 10+ years, marriage, kids
3. **Multiple Scenarios** - Different life paths
4. **Research API** - Anonymized data for researchers
5. **Mobile App** - Native iOS/Android experience

---

## 13. Resources

### Official Documentation
- **Antigravity:** https://antigravity.codes/
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Anthropic API:** https://docs.anthropic.com
- **Tailwind CSS:** https://tailwindcss.com/docs

### Community
- **Antigravity Discord:** https://discord.gg/antigravity
- **Supabase Discord:** https://discord.supabase.com
- **Next.js Discord:** https://discord.gg/nextjs

### Learning
- **Antigravity Tutorials:** https://codelabs.developers.google.com/
- **Next.js Learn:** https://nextjs.org/learn
- **Supabase University:** https://supabase.com/docs/guides

---

## Conclusion

You now have a complete guide to building ThePlot with Google Antigravity. The agent-first approach allows you to:

1. **Delegate complex tasks** to AI agents
2. **Review and approve** plans before execution
3. **Iterate quickly** with AI assistance
4. **Build faster** than traditional coding

**Remember:**
- Start with clear, specific prompts
- Review all agent-generated code
- Test thoroughly on multiple devices
- Prioritize user safety and ethics
- Launch with monitoring active

**Good luck building ThePlot! 🚀**

---

**Document End**
