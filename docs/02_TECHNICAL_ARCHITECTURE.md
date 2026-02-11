# ThePlot - Technical Architecture Document
**Building on Antigravity + Groq + Open Source**

---

## 🏗️ System Architecture Overview

ThePlot is built as a serverless, stateless application using Antigravity for rapid frontend development, Vercel for hosting and serverless functions, and Groq API for high-performance AI inference.

### Core Principles

1. **Stateless Architecture** - No traditional database, all data flows through client and serverless functions
2. **Speed First** - Groq's LPU inference for sub-second AI responses
3. **Cost Optimization** - Free tier maximization, pay-per-use scaling
4. **Privacy by Design** - Minimal data retention, user-controlled sharing
5. **Viral by Default** - Built-in sharing, social features, analytics

---

## 📦 Technology Stack

### Frontend Layer

**Antigravity Framework**
- React-based component system
- Built-in routing and state management
- Rapid prototyping capabilities
- Responsive design system

**UI Components**
- Landing page with video hero
- Multi-step form wizard (personality assessment)
- Real-time simulation viewer (chat interface)
- Analysis report dashboard
- Social sharing interface

**Client-Side Storage**
- localStorage for session persistence
- IndexedDB for large transcript storage
- JSON export functionality

### Backend Layer

**Vercel Platform**
- Serverless Functions (API routes)
- Edge Functions for global distribution
- Automatic HTTPS and CDN
- Git-based deployment

**API Routes Structure**
```
/api/create-session        - Initialize new simulation
/api/process-assessment    - Store personality data
/api/run-simulation        - Orchestrate agent interactions
/api/stream-conversation   - Real-time conversation streaming
/api/generate-analysis     - Create compatibility report
/api/create-share-link     - Generate shareable URL
```

**Storage Solutions**
- Vercel KV (Redis) - Session management (TTL: 24 hours)
- Vercel Blob - Transcript archives (optional upgrade)
- Client-side - Primary data store (localStorage/IndexedDB)

### AI Infrastructure

**Groq Cloud API**
- Primary Model: Llama 3.1 70B Instruct
- Backup Model: Mixtral 8x7B Instruct
- Inference Speed: 300+ tokens/second
- Context Window: 128k tokens

**Model Selection Strategy**
```
Primary Use Cases:
- Llama 3.1 70B → Personality modeling, simulation
- Mixtral 8x7B → Quick responses, analysis generation
- Llama 3.1 8B → Simple tasks, fallback

Cost Optimization:
- Use 8B for initial assessment processing
- Use 70B for actual simulation
- Batch similar requests
```

### Development Tools

**Version Control**
- GitHub repository
- Feature branch workflow
- Automated deployments via Vercel

**Development Environment**
- Node.js v20+
- Antigravity CLI
- Environment variables (.env.local)

---

## 🧩 Component Architecture

### 1. Landing Page Component

**Purpose:** Convert visitors to users  
**Key Features:**
- Hero video (auto-play, muted)
- Viral hook headline
- Social proof section
- Single prominent CTA
- FAQ section
- Testimonials carousel

**Technical Implementation:**
```javascript
// Landing.jsx
- Video player (HTML5, optimized)
- Scroll animations (Intersection Observer)
- CTA tracking (analytics events)
- Email capture form (Vercel API route)
```

### 2. Assessment Wizard Component

**Purpose:** Capture personality data  
**Key Features:**
- 120+ questions across 12 domains
- Progress bar with milestones
- Adaptive branching logic
- Auto-save functionality
- Personality preview (live updates)
- Mobile-optimized input

**Technical Implementation:**
```javascript
// AssessmentWizard.jsx
- Multi-step form state management
- Question branching engine
- localStorage persistence
- Real-time validation
- Progress calculation
- Domain completion tracking

// Question Types:
1. Multiple choice (radio)
2. Rating scales (1-10 slider)
3. Priority ranking (drag-drop)
4. Free text (short answer)
5. Scenario-based (mini case studies)
```

**Data Structure:**
```json
{
  "sessionId": "uuid-v4",
  "userId": "user-id",
  "timestamp": "ISO-8601",
  "domains": {
    "coreValues": {
      "questions": [...],
      "score": 0-100,
      "traits": ["ambitious", "family-oriented"]
    },
    "communicationStyle": {...},
    // ... 10 more domains
  },
  "personalityVector": [0.7, 0.3, 0.9, ...], // 50-dim vector
  "completionStatus": "in-progress" | "completed"
}
```

### 3. Agent Training Component

**Purpose:** Build AI personality models  
**Key Features:**
- Visual representation of agent "learning"
- Trait emergence animation
- Confirmation/adjustment interface
- Final agent summary

**Technical Implementation:**
```javascript
// AgentTraining.jsx
- Personality data processing
- System prompt generation
- Agent preview chat (test conversation)
- Trait visualization (radar chart)
```

**Prompt Engineering:**
```
System Prompt Template:
"You are [Name], a [age]-year-old [gender] with the following personality:

CORE TRAITS:
- {trait1}: {description}
- {trait2}: {description}
...

COMMUNICATION STYLE:
{style_description}

CONFLICT APPROACH:
{conflict_style}

LIFE PHILOSOPHY:
{values}

RELATIONSHIP HISTORY:
{past_patterns}

YOU MUST:
- Respond as this person would in real life
- Reference their specific beliefs and values
- Use their typical language patterns
- Show their emotional responses accurately
- Never break character

CURRENT SCENARIO: {scenario_context}"
```

### 4. Simulation Engine Component

**Purpose:** Run relationship simulation  
**Key Features:**
- Real-time conversation display
- Pause/resume controls
- Speed adjustment (1x, 2x, 5x)
- Emotional state indicators
- Milestone markers
- Crisis moment highlighting

**Technical Implementation:**
```javascript
// SimulationEngine.jsx

// Simulation Flow:
1. Initialize agents with system prompts
2. Set scenario context
3. Begin conversation loop:
   - Agent A generates response (Groq API)
   - Display with typing animation
   - Update emotional state
   - Agent B generates response
   - Repeat for N turns
4. Check for milestone events
5. Inject scenario complications
6. Continue until scenario complete

// Real-time Streaming:
- Server-Sent Events (SSE) for live updates
- Or WebSocket for bidirectional control
- Backpressure handling for slow clients
```

**Scenario Definitions:**
```javascript
const scenarios = {
  firstDate: {
    duration: "30 turns",
    context: "First coffee date, getting to know each other",
    injections: [
      { turn: 10, event: "awkward_silence" },
      { turn: 20, event: "controversial_topic" }
    ]
  },
  firstConflict: {
    duration: "50 turns",
    context: "Disagreement about [topic from assessment]",
    injections: [
      { turn: 15, event: "escalation" },
      { turn: 30, event: "breakthrough_moment" }
    ]
  },
  // ... more scenarios
}
```

### 5. Analysis Report Component

**Purpose:** Present compatibility insights  
**Key Features:**
- Overall compatibility score
- Domain-by-domain breakdown
- Key strengths/weaknesses
- Predicted challenges
- Actionable advice
- Download PDF option
- Share controls

**Technical Implementation:**
```javascript
// AnalysisReport.jsx
- Data visualization (charts)
- Score animations
- Highlight extraction
- PDF generation (jsPDF)
- Social share buttons
```

**Analysis Algorithm:**
```javascript
function generateCompatibilityScore(conversation, agents) {
  const metrics = {
    communicationHarmony: analyzeConversationFlow(),
    valueAlignment: compareCorePrinciples(),
    conflictResolution: evaluateDisagreements(),
    emotionalSupport: detectSupportPatterns(),
    longTermGoals: assessSharedVision(),
    intimacyPotential: measureEmotionalDepth()
  };
  
  const weights = {
    communicationHarmony: 0.25,
    valueAlignment: 0.25,
    conflictResolution: 0.20,
    emotionalSupport: 0.15,
    longTermGoals: 0.10,
    intimacyPotential: 0.05
  };
  
  return calculateWeightedScore(metrics, weights);
}
```

### 6. Sharing System Component

**Purpose:** Enable viral distribution  
**Key Features:**
- Generate unique share links
- Privacy controls (public/private/password)
- Embed code for websites
- Social media optimization
- View analytics

**Technical Implementation:**
```javascript
// SharingSystem.jsx

// Link Generation:
POST /api/create-share-link
{
  sessionId: "uuid",
  privacy: "public" | "private" | "password",
  password?: "hashed-pwd",
  includeTranscript: boolean,
  includeAnalysis: boolean
}

// Returns:
{
  shareId: "short-id-8chars",
  shareUrl: "theplot.app/s/ABC12345",
  embedCode: "<iframe src='...'></iframe>"
}

// View Page:
GET /s/ABC12345
- Fetch session data from Vercel KV
- Render read-only simulation results
- Track view analytics
- Show "Create Your Own" CTA
```

---

## 🔄 Data Flow Architecture

### User Journey Data Flow

```
1. LANDING → SIGNUP
   Browser → /api/auth/signup → Vercel KV (store user) → Client

2. ASSESSMENT
   Client (form data) → localStorage (auto-save)
   → /api/process-assessment → Generate personality vector
   → localStorage (store result)

3. AGENT TRAINING
   Client (personality data) → /api/generate-agent-prompt
   → Return system prompts → Client

4. SIMULATION
   Client → /api/run-simulation (POST personality data)
   → Initialize Groq conversation
   → Stream responses (SSE)
   → Client (display + store in IndexedDB)

5. ANALYSIS
   Client (conversation transcript) → /api/generate-analysis
   → Groq API (analyze patterns) → Return report
   → Client (display + localStorage)

6. SHARING
   Client → /api/create-share-link (session data)
   → Vercel KV (store with TTL) → Return short URL
   → Client (display share modal)
```

### Conversation Simulation Flow

```javascript
// Serverless Function: /api/run-simulation

export default async function handler(req, res) {
  const { agentA, agentB, scenario } = req.body;
  
  // Set up SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  let conversationHistory = [];
  const maxTurns = scenario.duration;
  
  for (let turn = 0; turn < maxTurns; turn++) {
    // Agent A's turn
    const responseA = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: agentA.systemPrompt },
        ...conversationHistory,
        { role: "user", content: scenario.context }
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    
    const messageA = responseA.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: messageA });
    
    // Stream to client
    res.write(`data: ${JSON.stringify({
      speaker: "agentA",
      message: messageA,
      turn: turn,
      emotion: detectEmotion(messageA)
    })}\n\n`);
    
    // Check for scenario injections
    const injection = scenario.injections.find(i => i.turn === turn);
    if (injection) {
      conversationHistory.push({
        role: "system",
        content: `[SCENARIO EVENT: ${injection.event}]`
      });
    }
    
    // Agent B's turn
    const responseB = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: agentB.systemPrompt },
        ...conversationHistory
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    
    const messageB = responseB.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: messageB });
    
    res.write(`data: ${JSON.stringify({
      speaker: "agentB",
      message: messageB,
      turn: turn + 0.5,
      emotion: detectEmotion(messageB)
    })}\n\n`);
    
    // Check for early termination (if agents reach conclusion)
    if (shouldTerminateEarly(conversationHistory)) {
      break;
    }
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
}
```

---

## 🔐 Security & Privacy

### Data Protection Strategy

**1. Minimal Data Collection**
- No personal identifiable information required
- Email only (for account creation)
- Personality data stored client-side first

**2. Encryption**
- HTTPS everywhere (Vercel default)
- Sensitive data encrypted at rest (Vercel KV)
- Optional E2E encryption for transcripts

**3. Data Retention**
- Session data: 24-hour TTL in Vercel KV
- Share links: 30-day TTL (configurable)
- User accounts: Persistent until deletion
- Right to be forgotten: Complete data purge

**4. Privacy Controls**
- Granular sharing settings
- Anonymous mode (no account required)
- Password-protected shares
- Opt-out of analytics

### Rate Limiting & Abuse Prevention

```javascript
// Vercel Edge Middleware: rate-limit.js

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

export async function middleware(request) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Too Many Requests", { status: 429 });
  }
  
  return NextResponse.next();
}
```

---

## 📊 Analytics & Monitoring

### Event Tracking

**Key Events:**
- Page views (landing, assessment, simulation, report)
- Assessment started/completed
- Simulation started/completed
- Share link created/viewed
- Conversion to paid (future)

**Implementation:**
```javascript
// Simple analytics (Vercel Analytics built-in)
import { Analytics } from '@vercel/analytics/react';

// Custom events
track('simulation_started', {
  scenario: 'first_date',
  user_type: 'free'
});

track('assessment_completed', {
  domain_scores: {...},
  completion_time_minutes: 18
});
```

### Performance Monitoring

**Metrics to Track:**
- API response times (p50, p95, p99)
- Groq API latency
- Simulation completion rate
- Error rates by endpoint
- Client-side performance (Lighthouse scores)

**Tools:**
- Vercel Analytics (built-in)
- Sentry (error tracking)
- Groq API dashboard (usage monitoring)

---

## 🚀 Deployment Strategy

### Environment Setup

**Development**
```bash
# .env.local
GROQ_API_KEY=gsk_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
KV_REST_API_URL=https://xxx.upstash.io
KV_REST_API_TOKEN=xxx
```

**Production**
```bash
# Vercel Environment Variables
GROQ_API_KEY=gsk_prod_xxx
NEXT_PUBLIC_APP_URL=https://theplot.app
KV_REST_API_URL=https://prod.upstash.io
KV_REST_API_TOKEN=xxx
```

### Deployment Pipeline

```bash
# GitHub Workflow

1. Push to main branch
2. Vercel detects commit
3. Build process:
   - Install dependencies
   - Run linting
   - Build Antigravity app
   - Generate static pages
4. Deploy to Vercel Edge Network
5. Run smoke tests
6. Update deployment status in GitHub
7. Notify team on Slack
```

### Rollback Strategy

- Vercel instant rollback to previous deployment
- Feature flags for gradual rollout
- A/B testing framework for new features

---

## 🎨 UI/UX Specifications

### Design System

**Color Palette**
```css
/* Primary */
--color-primary: #FF1744;      /* Passionate Red */
--color-secondary: #7C4DFF;    /* Deep Purple */
--color-accent: #00E676;       /* Success Green */

/* Neutrals */
--color-bg-dark: #0A0A0A;
--color-bg-light: #1A1A1A;
--color-text-primary: #FFFFFF;
--color-text-secondary: #B0B0B0;

/* Semantic */
--color-success: #00E676;
--color-warning: #FFD600;
--color-error: #FF1744;
--color-info: #00B8D4;
```

**Typography**
```css
/* Fonts */
--font-display: 'Space Grotesk', sans-serif;  /* Headlines */
--font-body: 'Inter', sans-serif;              /* Body text */
--font-mono: 'JetBrains Mono', monospace;     /* Code/Tech */

/* Scale */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 32px;
--text-3xl: 48px;
--text-4xl: 64px;
```

**Spacing**
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Component Library

**Buttons**
```jsx
<Button variant="primary" size="lg">
  Start Your Simulation
</Button>

<Button variant="secondary" size="md" icon={<ShareIcon />}>
  Share Results
</Button>

<Button variant="ghost" size="sm">
  Learn More
</Button>
```

**Form Inputs**
```jsx
<Input
  type="text"
  label="Your Name"
  placeholder="Enter your name"
  error="Name is required"
/>

<Slider
  label="How important is financial stability?"
  min={1}
  max={10}
  value={7}
  onChange={handleChange}
/>

<RadioGroup
  label="What's your conflict style?"
  options={[
    { value: "avoid", label: "Avoid confrontation" },
    { value: "compromise", label: "Find middle ground" },
    { value: "assertive", label: "Stand your ground" }
  ]}
/>
```

**Chat Interface**
```jsx
<ChatMessage
  speaker="Agent A"
  message="I think we should talk about our future..."
  emotion="thoughtful"
  timestamp="2:34"
  avatar="/avatars/agent-a.png"
/>

<ChatMessage
  speaker="Agent B"
  message="I'm not sure I'm ready for that conversation."
  emotion="anxious"
  timestamp="2:35"
  avatar="/avatars/agent-b.png"
  highlight={true}  // Critical moment
/>
```

### Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## 🧪 Testing Strategy

### Unit Tests

```javascript
// Example: Assessment logic tests
describe('PersonalityVector', () => {
  test('generates 50-dimension vector from answers', () => {
    const answers = {...};
    const vector = generatePersonalityVector(answers);
    expect(vector).toHaveLength(50);
    expect(vector[0]).toBeGreaterThanOrEqual(0);
    expect(vector[0]).toBeLessThanOrEqual(1);
  });
});
```

### Integration Tests

```javascript
// Example: End-to-end simulation test
describe('Simulation Flow', () => {
  test('completes first date scenario', async () => {
    const agentA = createTestAgent('optimistic');
    const agentB = createTestAgent('cautious');
    
    const result = await runSimulation({
      agents: [agentA, agentB],
      scenario: 'firstDate'
    });
    
    expect(result.turns).toBeGreaterThan(20);
    expect(result.completed).toBe(true);
    expect(result.compatibilityScore).toBeDefined();
  });
});
```

### Load Testing

```javascript
// Simulate 1000 concurrent simulations
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1000,
  duration: '5m',
};

export default function () {
  const res = http.post('https://theplot.app/api/run-simulation', {
    // ... test payload
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
}
```

---

## 📈 Scalability Considerations

### Current Architecture Limits

**Groq API**
- Rate Limit: ~6000 requests/minute (free tier)
- Solution: Paid tier, queue management, caching

**Vercel Functions**
- Timeout: 10 seconds (hobby), 60s (pro)
- Solution: Break long simulations into chunks

**Client Storage**
- localStorage: 5-10 MB limit
- IndexedDB: ~50 MB (mobile), unlimited (desktop)
- Solution: Compress transcripts, encourage downloads

### Scaling Plan

**Phase 1 (0-10k users)**
- Single Vercel project
- Groq free tier
- No caching layer

**Phase 2 (10k-100k users)**
- Vercel Pro plan
- Groq paid tier
- Redis caching for common queries
- CDN for static assets

**Phase 3 (100k+ users)**
- Multi-region deployment
- Dedicated Groq contract
- Database for analytics (ClickHouse)
- Microservices architecture (if needed)

---

## 🛠️ Development Roadmap

### Week 1-2: Foundation
- [ ] Set up Vercel project
- [ ] Configure Antigravity
- [ ] Design system implementation
- [ ] Landing page
- [ ] User authentication

### Week 3-4: Assessment Module
- [ ] Question database creation
- [ ] Form wizard UI
- [ ] Branching logic engine
- [ ] Personality vector generation
- [ ] Agent prompt engineering

### Week 5-6: Simulation Engine
- [ ] Groq API integration
- [ ] Conversation orchestration
- [ ] Real-time streaming UI
- [ ] Scenario definitions
- [ ] Emotion detection

### Week 7-8: Analysis & Sharing
- [ ] Compatibility algorithm
- [ ] Report generation
- [ ] PDF export
- [ ] Share link system
- [ ] Analytics integration

### Week 9-10: Polish & Launch
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Marketing materials
- [ ] Launch preparation

---

## 📚 Code Examples & Snippets

### Groq Integration Example

```javascript
// lib/groq.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function createAgentResponse(systemPrompt, conversationHistory, temperature = 0.8) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ],
      temperature: temperature,
      max_tokens: 300,
      top_p: 0.9,
      stream: false
    });
    
    return {
      success: true,
      message: completion.choices[0].message.content,
      usage: completion.usage
    };
  } catch (error) {
    console.error("Groq API Error:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function streamAgentResponse(systemPrompt, conversationHistory) {
  const stream = await groq.chat.completions.create({
    model: "llama-3.1-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory
    ],
    temperature: 0.8,
    max_tokens: 300,
    stream: true
  });
  
  return stream;
}
```

### Personality Vector Generation

```javascript
// lib/personality.js

const TRAIT_DIMENSIONS = {
  openness: [/* relevant question IDs */],
  conscientiousness: [/* relevant question IDs */],
  extraversion: [/* relevant question IDs */],
  agreeableness: [/* relevant question IDs */],
  neuroticism: [/* relevant question IDs */],
  // ... custom dimensions
};

export function generatePersonalityVector(assessmentAnswers) {
  const vector = [];
  
  for (const [trait, questionIds] of Object.entries(TRAIT_DIMENSIONS)) {
    const relevantAnswers = questionIds.map(id => assessmentAnswers[id]);
    const traitScore = calculateTraitScore(relevantAnswers);
    vector.push(traitScore);
  }
  
  return normalizeVector(vector);
}

function calculateTraitScore(answers) {
  // Convert answers to numerical values
  const numericalAnswers = answers.map(answer => {
    if (typeof answer === 'number') return answer / 10; // Scale to 0-1
    if (typeof answer === 'boolean') return answer ? 1 : 0;
    // Handle text answers with sentiment analysis
    return analyzeSentiment(answer);
  });
  
  return numericalAnswers.reduce((sum, val) => sum + val, 0) / answers.length;
}

function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}
```

### Agent System Prompt Builder

```javascript
// lib/agentPrompt.js

export function buildAgentSystemPrompt(personalityData, agentName) {
  const {
    coreValues,
    communicationStyle,
    conflictResolution,
    lifePriorities,
    relationshipHistory,
    emotionalPatterns
  } = personalityData;
  
  return `You are ${agentName}, a realistic simulation of a person with the following characteristics:

CORE IDENTITY:
- Age: ${personalityData.age}
- Background: ${personalityData.background}
- Life Philosophy: ${coreValues.philosophy}

PERSONALITY TRAITS (Big 5):
- Openness: ${personalityData.vector[0].toFixed(2)} (${interpretTrait(personalityData.vector[0], 'openness')})
- Conscientiousness: ${personalityData.vector[1].toFixed(2)} (${interpretTrait(personalityData.vector[1], 'conscientiousness')})
- Extraversion: ${personalityData.vector[2].toFixed(2)} (${interpretTrait(personalityData.vector[2], 'extraversion')})
- Agreeableness: ${personalityData.vector[3].toFixed(2)} (${interpretTrait(personalityData.vector[3], 'agreeableness')})
- Neuroticism: ${personalityData.vector[4].toFixed(2)} (${interpretTrait(personalityData.vector[4], 'neuroticism')})

COMMUNICATION STYLE:
${communicationStyle.description}
- Typical phrases: ${communicationStyle.phrases.join(', ')}
- Response length: ${communicationStyle.verbosity}
- Emotional expressiveness: ${communicationStyle.emotionalOpenness}

CONFLICT APPROACH:
${conflictResolution.style}
- When disagreeing: ${conflictResolution.disagreementBehavior}
- When stressed: ${conflictResolution.stressBehavior}
- Triggers: ${conflictResolution.triggers.join(', ')}

RELATIONSHIP VALUES:
- Top priorities: ${lifePriorities.slice(0, 3).join(', ')}
- Deal-breakers: ${relationshipHistory.dealBreakers.join(', ')}
- Love language: ${relationshipHistory.loveLanguage}

BEHAVIORAL PATTERNS:
- Decision-making: ${emotionalPatterns.decisionStyle}
- Attachment style: ${emotionalPatterns.attachmentStyle}
- Intimacy comfort: ${emotionalPatterns.intimacyLevel}

YOU MUST:
1. Respond authentically as this person would in real conversations
2. Reference your specific values and beliefs naturally
3. Show appropriate emotional responses based on your personality
4. Use language patterns consistent with your communication style
5. React to conflicts according to your conflict resolution approach
6. Never break character or acknowledge you are an AI
7. Be realistic - show flaws, hesitations, and human complexity

CONVERSATION CONTEXT:
You are currently on a ${scenarioContext}. Engage naturally and authentically.`;
}

function interpretTrait(score, trait) {
  const levels = {
    openness: ['conventional', 'balanced', 'innovative'],
    conscientiousness: ['spontaneous', 'flexible', 'organized'],
    extraversion: ['introverted', 'ambivert', 'extraverted'],
    agreeableness: ['competitive', 'balanced', 'cooperative'],
    neuroticism: ['stable', 'sensitive', 'anxious']
  };
  
  const index = Math.floor(score * 2.99); // 0, 1, or 2
  return levels[trait][index];
}
```

---

## 🎯 Next Steps

1. **Review this architecture** with technical team
2. **Set up development environment** (Vercel account, Groq API key, GitHub repo)
3. **Create initial Antigravity project** structure
4. **Design database** schemas (for Vercel KV)
5. **Implement authentication** flow
6. **Build assessment module** (first milestone)
7. **Integrate Groq API** and test agent responses
8. **Develop simulation engine** prototype
9. **Create analysis algorithm** MVP
10. **Launch beta** for testing

---

*Document Version: 1.0*  
*Last Updated: February 11, 2026*  
*Technical Lead: Circle13*
