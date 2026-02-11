# Technical Specifications Document
## ThePlot: AI-Powered Relationship Simulation

---

## Document Control
- **Version:** 1.0
- **Date:** February 11, 2026
- **Status:** Ready for Implementation
- **Target Environment:** Production

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐              ┌──────────────┐             │
│  │  User A      │              │  User B      │             │
│  │  (Mobile)    │              │  (Mobile)    │             │
│  └──────┬───────┘              └──────┬───────┘             │
│         │                              │                     │
│         └──────────────┬───────────────┘                     │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ WebSocket (Real-time)
                         │ HTTPS (API calls)
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    APPLICATION LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │          Next.js 14 (App Router)                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │ │
│  │  │   Pages     │  │     API     │  │   WebSocket    │  │ │
│  │  │  (Routes)   │  │   Routes    │  │    Server      │  │ │
│  │  └─────────────┘  └─────────────┘  └────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌─────────────┐
│   Supabase    │  │   Anthropic   │  │   Vercel    │
│  Realtime     │  │   Claude API  │  │   Hosting   │
│  (Sessions)   │  │   (AI Agents) │  │   (Edge)    │
└───────────────┘  └───────────────┘  └─────────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework:** Next.js 14.2+ (App Router)
- **Language:** TypeScript 5.3+
- **Styling:** Tailwind CSS 3.4+
- **UI Components:** shadcn/ui (optional)
- **Animation:** Framer Motion 11+
- **State Management:** React Hooks + Context API

#### Backend
- **Runtime:** Node.js 20+ (Vercel Edge)
- **API:** Next.js API Routes
- **Real-time:** Supabase Realtime
- **Session Storage:** Supabase (ephemeral)

#### AI/ML
- **Primary Model:** Claude Sonnet 4.5 (Anthropic)
- **SDK:** @anthropic-ai/sdk 0.30+
- **Fallback:** OpenAI GPT-4o (optional)

#### Infrastructure
- **Hosting:** Vercel (Edge Network)
- **CDN:** Vercel Edge Network
- **Analytics:** Vercel Analytics + Google Analytics 4
- **Monitoring:** Vercel Logs + Sentry (errors)

#### Development Tools
- **IDE:** Google Antigravity (primary) / VS Code
- **Version Control:** Git + GitHub
- **Package Manager:** pnpm (fast, efficient)
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library

---

## 2. Data Architecture

### 2.1 Data Flow

```
User Input → Session Storage → AI Processing → Real-time Broadcast → Display
     ↓
Ephemeral (30min TTL) → Auto-delete → No persistent storage
```

### 2.2 Session Data Model

```typescript
interface Session {
  id: string;                    // UUID v4
  created_at: number;            // Unix timestamp
  expires_at: number;            // created_at + 30 minutes
  status: 'waiting' | 'active' | 'completed' | 'expired';
  
  users: {
    userA: UserData | null;
    userB: UserData | null;
  };
  
  simulation?: SimulationResult;
}

interface UserData {
  userId: string;                // Anonymous ID (no PII)
  answers: Answer[];
  connected: boolean;
  lastSeen: number;
}

interface Answer {
  questionId: string;
  value: string;
  timestamp: number;
}

interface SimulationResult {
  timeline: YearEvent[];
  outcome: OutcomeType;
  insights: string[];
  emotionalMetrics: EmotionalState[];
}

interface YearEvent {
  year: number;
  events: string[];
  emotionalShift: {
    trust: number;        // -100 to +100
    satisfaction: number; // -100 to +100
    commitment: number;   // -100 to +100
  };
}

type OutcomeType = 
  | 'success_strong'
  | 'success_engaged'
  | 'success_thriving'
  | 'challenge_break'
  | 'challenge_different_paths'
  | 'challenge_timing';

interface EmotionalState {
  year: number;
  trust: number;
  satisfaction: number;
  commitment: number;
}
```

### 2.3 Supabase Schema

```sql
-- Sessions table (ephemeral, auto-delete after 1 hour)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 minutes',
  status TEXT NOT NULL DEFAULT 'waiting',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Indexes
  CONSTRAINT valid_status CHECK (status IN ('waiting', 'active', 'completed', 'expired'))
);

-- Auto-delete expired sessions (runs every 5 minutes)
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('cleanup-sessions', '*/5 * * * *', 'SELECT delete_expired_sessions()');

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
```

**Important:** No PII stored. All data is ephemeral and auto-deleted.

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
theplot/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── session/
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Session page (lobby + simulation)
│   │   │       └── loading.tsx
│   │   └── api/
│   │       ├── session/
│   │       │   ├── create/route.ts
│   │       │   └── join/route.ts
│   │       └── simulate/route.ts
│   ├── components/
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── Disclaimer.tsx
│   │   ├── session/
│   │   │   ├── Lobby.tsx
│   │   │   ├── QRCode.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── questions/
│   │   │   ├── QuestionFlow.tsx
│   │   │   └── QuestionCard.tsx
│   │   ├── simulation/
│   │   │   ├── Terminal.tsx
│   │   │   ├── EventDisplay.tsx
│   │   │   ├── YearCounter.tsx
│   │   │   └── EmotionalMetrics.tsx
│   │   └── results/
│   │       ├── OutcomeDisplay.tsx
│   │       ├── TimelineSummary.tsx
│   │       └── ShareButtons.tsx
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── anthropic.ts            # Claude API wrapper
│   │   ├── simulation.ts           # Simulation logic
│   │   └── questions.ts            # Question bank
│   ├── hooks/
│   │   ├── useSession.ts
│   │   ├── useRealtime.ts
│   │   └── useSimulation.ts
│   └── types/
│       └── index.ts                # TypeScript definitions
├── public/
│   └── fonts/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 3.2 Key Components

#### Landing Page (`app/page.tsx`)
```typescript
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Disclaimer />
      <HowItWorks />
      <CTAButton />
      <Footer />
    </>
  );
}
```

#### Session Page (`app/session/[id]/page.tsx`)
```typescript
'use client';

export default function SessionPage({ params }: { params: { id: string } }) {
  const { session, updateSession } = useSession(params.id);
  const [stage, setStage] = useState<'lobby' | 'questions' | 'simulation' | 'results'>('lobby');

  return (
    <>
      {stage === 'lobby' && <Lobby session={session} onReady={() => setStage('questions')} />}
      {stage === 'questions' && <QuestionFlow onComplete={() => setStage('simulation')} />}
      {stage === 'simulation' && <Terminal session={session} onComplete={() => setStage('results')} />}
      {stage === 'results' && <Results simulation={session.simulation} />}
    </>
  );
}
```

#### Terminal Component (`components/simulation/Terminal.tsx`)
```typescript
export function Terminal({ session }: { session: Session }) {
  const [currentYear, setCurrentYear] = useState(1);
  const [events, setEvents] = useState<string[]>([]);
  
  // Simulate year progression
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentYear < 7) {
        setCurrentYear(prev => prev + 1);
        // Fetch next year's events
      }
    }, 8000); // 8 seconds per year
    
    return () => clearInterval(timer);
  }, [currentYear]);

  return (
    <div className="terminal-screen">
      <YearCounter year={currentYear} />
      <EventDisplay events={events} />
      <EmotionalMetrics state={session.simulation?.emotionalMetrics[currentYear - 1]} />
    </div>
  );
}
```

### 3.3 Real-time Synchronization

```typescript
// hooks/useRealtime.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtime(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Subscribe to session changes
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          setSession(payload.new as Session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return session;
}
```

---

## 4. Backend Architecture

### 4.1 API Endpoints

#### `POST /api/session/create`
Creates new simulation session and returns session ID + QR code.

**Request:**
```json
{}  // No body required
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "qrCodeUrl": "https://theplot.app/session/550e8400...",
  "expiresAt": 1676390400
}
```

#### `POST /api/session/join`
Second user joins existing session.

**Request:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user_b_random_id"
}
```

**Response:**
```json
{
  "success": true,
  "session": { /* session data */ }
}
```

#### `POST /api/session/answer`
Submit answer to question.

**Request:**
```json
{
  "sessionId": "550e8400...",
  "userId": "user_a_random_id",
  "answers": [
    { "questionId": "q1", "value": "Talk it out" },
    { "questionId": "q2", "value": "Trust" },
    { "questionId": "q3", "value": "Be hurt but talk about it" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "bothUsersReady": true
}
```

#### `POST /api/simulate`
Runs AI simulation (triggered when both users ready).

**Request:**
```json
{
  "sessionId": "550e8400...",
  "userAData": { /* answers */ },
  "userBData": { /* answers */ }
}
```

**Response:**
```json
{
  "simulation": {
    "timeline": [ /* year events */ ],
    "outcome": "success_strong",
    "insights": [ /* compatibility insights */ ]
  }
}
```

### 4.2 AI Simulation Logic

```typescript
// lib/simulation.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function runSimulation(
  userA: UserData,
  userB: UserData
): Promise<SimulationResult> {
  
  // Build agent personalities from answers
  const agentAPersonality = buildPersonality(userA.answers);
  const agentBPersonality = buildPersonality(userB.answers);

  // System prompt for simulation
  const systemPrompt = `You are simulating a 7-year relationship between two people.

Agent A Personality:
${agentAPersonality}

Agent B Personality:
${agentBPersonality}

Generate a year-by-year relationship timeline with 3-5 major events per year.
Output ONLY events and emotional state changes, not dialogue.

Format as JSON:
{
  "years": [
    {
      "year": 1,
      "events": ["Event 1", "Event 2", "Event 3"],
      "emotionalShift": { "trust": 10, "satisfaction": 15, "commitment": 20 }
    }
  ],
  "outcome": "success_strong" | "challenge_break" | etc.,
  "insights": ["Insight 1", "Insight 2"]
}

CRITICAL: 70% of simulations must have positive outcomes. Focus on growth, communication, and resilience.
Avoid: Abuse, infidelity, severe trauma. Keep challenges realistic but hopeful.
`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: 'Generate the 7-year relationship simulation based on the personalities above.',
      },
    ],
    system: systemPrompt,
  });

  // Parse response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const simulation = JSON.parse(content.text);
  
  return {
    timeline: simulation.years,
    outcome: simulation.outcome,
    insights: simulation.insights,
    emotionalMetrics: calculateMetrics(simulation.years),
  };
}

function buildPersonality(answers: Answer[]): string {
  // Map answers to personality description
  const q1 = answers.find(a => a.questionId === 'q1')?.value;
  const q2 = answers.find(a => a.questionId === 'q2')?.value;
  const q3 = answers.find(a => a.questionId === 'q3')?.value;

  return `
Communication Style: ${q1}
Core Value: ${q2}
Conflict Response: ${q3}
  `.trim();
}

function calculateMetrics(years: YearEvent[]): EmotionalState[] {
  let trust = 50, satisfaction = 50, commitment = 50;
  
  return years.map(year => {
    trust += year.emotionalShift.trust;
    satisfaction += year.emotionalShift.satisfaction;
    commitment += year.emotionalShift.commitment;
    
    return {
      year: year.year,
      trust: Math.max(0, Math.min(100, trust)),
      satisfaction: Math.max(0, Math.min(100, satisfaction)),
      commitment: Math.max(0, Math.min(100, commitment)),
    };
  });
}
```

---

## 5. Deployment Architecture

### 5.1 Vercel Configuration

**`vercel.json`**
```json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 5.2 Environment Variables

**`.env.local` (development)**
```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

### 5.3 Scaling Strategy

#### Horizontal Scaling
- Vercel Edge Functions auto-scale
- No stateful backend (all state in Supabase)
- CDN caches static assets globally

#### Rate Limiting
```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

// Usage in API route
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    await limiter.check(10, req.headers.get('x-forwarded-for') || 'unknown');
    // Process request
  } catch {
    return new Response('Rate limit exceeded', { status: 429 });
  }
}
```

---

## 6. Security Architecture

### 6.1 Security Measures

1. **HTTPS Only**: All traffic encrypted in transit
2. **No PII Storage**: Zero personally identifiable information
3. **Session Encryption**: All session data encrypted
4. **Rate Limiting**: Prevent API abuse
5. **CORS Policy**: Restrict origins
6. **CSP Headers**: Prevent XSS attacks
7. **Input Validation**: Sanitize all user inputs
8. **API Key Rotation**: Monthly rotation schedule

### 6.2 Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.anthropic.com https://*.supabase.co;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 6.3 Input Sanitization

```typescript
// lib/validation.ts
import { z } from 'zod';

export const AnswerSchema = z.object({
  questionId: z.string().regex(/^q[1-3]$/),
  value: z.string().min(1).max(200),
  timestamp: z.number(),
});

export const SessionAnswersSchema = z.object({
  sessionId: z.string().uuid(),
  userId: z.string().regex(/^user_[ab]_[a-z0-9]{16}$/),
  answers: z.array(AnswerSchema).length(3),
});

// Usage
export async function POST(req: Request) {
  const body = await req.json();
  const validated = SessionAnswersSchema.parse(body); // Throws if invalid
  // Process validated data
}
```

---

## 7. Performance Optimization

### 7.1 Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint (FCP) | <1.5s | <3s |
| Largest Contentful Paint (LCP) | <2.5s | <4s |
| Total Blocking Time (TBT) | <200ms | <600ms |
| Cumulative Layout Shift (CLS) | <0.1 | <0.25 |
| Time to Interactive (TTI) | <3s | <5s |

### 7.2 Optimization Techniques

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const Terminal = dynamic(() => import('@/components/simulation/Terminal'), {
  loading: () => <TerminalSkeleton />,
  ssr: false,
});
```

#### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/hero-bg.jpg"
  alt="ThePlot Hero"
  width={1920}
  height={1080}
  priority
  quality={85}
  placeholder="blur"
/>
```

#### Font Optimization
```typescript
// app/layout.tsx
import { IBM_Plex_Mono } from 'next/font/google';

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});
```

#### API Response Caching
```typescript
export async function GET(req: Request) {
  const data = await fetchData();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 7.3 Bundle Size Budget

| Asset Type | Size Budget |
|------------|-------------|
| JavaScript (initial) | <150 KB (gzip) |
| JavaScript (total) | <300 KB (gzip) |
| CSS | <30 KB (gzip) |
| Fonts | <50 KB |
| Images (above fold) | <100 KB |

---

## 8. Monitoring & Observability

### 8.1 Logging Strategy

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, meta?: Record<string, any>) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...meta,
      timestamp: new Date().toISOString(),
    }));
  },
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  },
};

// Usage
logger.info('Simulation started', { sessionId, userCount: 2 });
logger.error('API call failed', error, { endpoint: '/api/simulate' });
```

### 8.2 Error Tracking (Sentry)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.request?.data) {
      delete event.request.data;
    }
    return event;
  },
});
```

### 8.3 Metrics Dashboard

**Key Metrics to Monitor:**
- Simulations per hour
- Completion rate
- Average session duration
- API response times
- Error rate
- Real-time connection failures
- Server resource usage

**Tools:**
- Vercel Analytics (built-in)
- Google Analytics 4 (custom events)
- Supabase Dashboard (database metrics)

---

## 9. Testing Strategy

### 9.1 Unit Tests (Jest)

```typescript
// __tests__/lib/simulation.test.ts
import { buildPersonality, calculateMetrics } from '@/lib/simulation';

describe('Simulation Logic', () => {
  test('buildPersonality creates valid personality string', () => {
    const answers = [
      { questionId: 'q1', value: 'Talk it out', timestamp: Date.now() },
      { questionId: 'q2', value: 'Trust', timestamp: Date.now() },
      { questionId: 'q3', value: 'Be hurt but talk about it', timestamp: Date.now() },
    ];
    
    const personality = buildPersonality(answers);
    expect(personality).toContain('Talk it out');
    expect(personality).toContain('Trust');
  });

  test('calculateMetrics bounds values between 0-100', () => {
    const years = [
      { year: 1, events: [], emotionalShift: { trust: 60, satisfaction: 60, commitment: 60 } },
    ];
    
    const metrics = calculateMetrics(years);
    expect(metrics[0].trust).toBeLessThanOrEqual(100);
    expect(metrics[0].trust).toBeGreaterThanOrEqual(0);
  });
});
```

### 9.2 Integration Tests

```typescript
// __tests__/api/session.test.ts
import { POST as createSession } from '@/app/api/session/create/route';

describe('/api/session/create', () => {
  test('creates session and returns valid ID', async () => {
    const response = await createSession(new Request('http://localhost:3000/api/session/create', {
      method: 'POST',
    }));
    
    const data = await response.json();
    expect(data.sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(data.qrCodeUrl).toContain('/session/');
  });
});
```

### 9.3 End-to-End Tests (Playwright - Optional)

```typescript
// e2e/simulation.spec.ts
import { test, expect } from '@playwright/test';

test('complete simulation flow', async ({ page, context }) => {
  // User A starts session
  await page.goto('/');
  await page.click('text=Start Simulation');
  
  const sessionUrl = page.url();
  
  // User B joins (new page)
  const userBPage = await context.newPage();
  await userBPage.goto(sessionUrl);
  
  // Both answer questions
  await page.click('text=Talk it out');
  await userBPage.click('text=Need alone time');
  
  // Simulation runs
  await expect(page.locator('.terminal')).toBeVisible({ timeout: 10000 });
  
  // Results displayed
  await expect(page.locator('text=Outcome')).toBeVisible({ timeout: 120000 });
});
```

---

## 10. Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel
- [ ] Supabase project created and configured
- [ ] Anthropic API key valid and funded
- [ ] Domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics tracking IDs configured

### Deployment
- [ ] Deploy to Vercel staging
- [ ] Run smoke tests on staging
- [ ] Check real-time sync works
- [ ] Verify AI simulation runs
- [ ] Test mobile responsiveness
- [ ] Deploy to production
- [ ] Run production smoke tests

### Post-Deployment
- [ ] Monitor error rates (Sentry)
- [ ] Check performance metrics (Vercel)
- [ ] Verify analytics tracking (GA4)
- [ ] Test on multiple devices
- [ ] Monitor API usage/costs
- [ ] Set up on-call rotation

---

## 11. Cost Estimation

### Monthly Costs (500 simulations/day)

| Service | Usage | Cost |
|---------|-------|------|
| Vercel Hosting | Free tier | $0 |
| Supabase | Free tier (ephemeral data) | $0 |
| Anthropic Claude API | 15,000 simulations/month @ $0.05 | $750 |
| Domain (optional) | - | $12/year |
| **Total** | | **~$750/month** |

**Cost Optimization:**
- Use cheaper model for Phase 1 (Claude Haiku)
- Implement aggressive caching
- Rate limit per user (5 simulations/day)
- Move to self-hosted open-source model long-term

---

## 12. API Integration with Antigravity

### 12.1 Antigravity Setup

**Install Antigravity:**
1. Download from https://antigravity.google/
2. Install and sign in with Google account
3. Open ThePlot project folder

**Configure Antigravity:**
1. Set Terminal Policy to "Request review"
2. Enable Agent-assisted development mode
3. Add project-specific skills (see below)

### 12.2 Antigravity Skills/Rules

Create `.antigravity/rules.md`:

```markdown
# ThePlot Development Rules

## Code Style
- Use TypeScript strict mode
- Prefer functional components
- Use Tailwind CSS for styling
- Async/await over promises

## AI Simulation
- Always bias toward positive outcomes (70%)
- Never generate traumatic content
- Validate all AI responses before display
- Include error handling for API failures

## Real-time
- Use Supabase Realtime for all sync
- Handle disconnection gracefully
- Show loading states for all async operations

## Security
- Never log user inputs
- Sanitize all data before storage
- Use environment variables for secrets
- Implement rate limiting on all public endpoints
```

### 12.3 Antigravity Workflows

**Example prompts for Antigravity:**

```
"Create a Next.js API route that accepts two user personalities and calls Claude API to generate a 7-year relationship simulation. Return JSON with timeline, outcome, and insights."

"Build a Terminal component that scrolls text Matrix-style, pauses on critical events, and updates a year counter. Use Framer Motion for animations."

"Implement Supabase Realtime sync between two clients in a session. When User B joins, both clients should see connection status update in <100ms."
```

---

**Document End**

For Antigravity prompts and implementation guide, see: `02_Antigravity_Implementation_Guide.md`
