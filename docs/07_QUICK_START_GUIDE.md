# ThePlot - Quick Start Guide
**Get Building in 30 Minutes**

---

## 🚀 Prerequisites

Before you start, make sure you have:

- [ ] Node.js v20+ installed
- [ ] GitHub account
- [ ] Vercel account (free tier is fine)
- [ ] Groq API key (get at console.groq.com)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/command line access

---

## ⚡ 30-Minute Setup

### Step 1: Environment Setup (5 minutes)

**Create project directory:**
```bash
mkdir theplot
cd theplot
```

**Initialize project:**
```bash
npm init -y
```

**Install core dependencies:**
```bash
# Core frameworks
npm install next@latest react@latest react-dom@latest

# AI & utilities
npm install groq-sdk

# Development
npm install -D typescript @types/react @types/node

# UI (optional but recommended)
npm install framer-motion lucide-react
```

**Create basic Next.js structure:**
```bash
mkdir -p app/api/{auth,assessment,simulation,analysis}
mkdir -p components/{ui,landing,assessment,simulation,results}
mkdir -p lib data public/images
touch app/layout.tsx app/page.tsx
```

### Step 2: Configuration Files (5 minutes)

**Create `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

**Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Create `.env.local`:**
```bash
# Groq API
GROQ_API_KEY=your_groq_api_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Create `.gitignore`:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel
```

### Step 3: Create Basic Groq Integration (5 minutes)

**Create `lib/groq.ts`:**
```typescript
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: any[] = []
) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return {
      success: true,
      message: completion.choices[0].message.content,
    };
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default groq;
```

### Step 4: Create Landing Page (5 minutes)

**Create `app/layout.tsx`:**
```typescript
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ThePlot - See Your Relationship\'s Future',
  description: 'AI-powered relationship simulation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

**Create `app/page.tsx`:**
```typescript
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            See Your Future Together
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            AI-powered relationship simulation that reveals your compatibility
            before you commit. Watch your digital twins navigate love, conflict,
            and life together.
          </p>
          <Link
            href="/assess"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition"
          >
            Start Free Simulation →
          </Link>
        </div>

        {/* Social Proof */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            🔥 <strong>50,000+</strong> relationships simulated  •  
            ⭐ <strong>4.9/5</strong> rating  •  
            💕 <strong>92%</strong> report better communication
          </p>
        </div>
      </div>
    </main>
  );
}
```

**Create `app/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

### Step 5: Deploy to Vercel (5 minutes)

**Initialize Git:**
```bash
git init
git add .
git commit -m "Initial commit"
```

**Push to GitHub:**
```bash
# Create new repo on GitHub first
git remote add origin https://github.com/yourusername/theplot.git
git branch -M main
git push -u origin main
```

**Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to GitHub repo
# - Set up project
# - Add environment variables (GROQ_API_KEY)
```

### Step 6: Test Everything (5 minutes)

**Start development server:**
```bash
npm run dev
```

**Open browser:**
```
http://localhost:3000
```

**Verify:**
- [ ] Landing page loads
- [ ] Tailwind CSS working
- [ ] No console errors
- [ ] Can click "Start Free Simulation"

---

## 🎯 Next Steps (Choose Your Path)

### Path A: Build Assessment First (Recommended)

**Why:** Get user data collection working before AI integration.

**Next tasks:**
1. Create question database (start with 30 questions)
2. Build question wizard component
3. Add localStorage persistence
4. Test completion flow

**Follow:** `03_ANTIGRAVITY_IMPLEMENTATION.md` Section 3.2

### Path B: Build Simulation First

**Why:** Want to see AI in action immediately.

**Next tasks:**
1. Create simple agent prompt
2. Build basic chat interface
3. Integrate Groq streaming
4. Test conversation quality

**Follow:** `03_ANTIGRAVITY_IMPLEMENTATION.md` Section 3.3

### Path C: Improve Landing Page

**Why:** Marketing-first approach, build hype.

**Next tasks:**
1. Add video hero section
2. Create testimonials
3. Build waitlist capture
4. Set up email system

**Follow:** `04_MARKETING_LAUNCH_STRATEGY.md` Section 2

---

## 🔧 Essential Code Snippets

### Reusable Button Component

**Create `components/ui/Button.tsx`:**
```typescript
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-full transition-all';
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    ghost: 'bg-transparent text-gray-300 hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
```

### Simple Question Card

**Create `components/assessment/QuestionCard.tsx`:**
```typescript
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface Option {
  value: string;
  label: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  onAnswer: (value: string) => void;
}

export default function QuestionCard({
  question,
  options,
  onAnswer,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{question}</h2>
      
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selected === option.value
                ? 'border-pink-500 bg-pink-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => selected && onAnswer(selected)}
        disabled={!selected}
        className="w-full"
      >
        Next →
      </Button>
    </div>
  );
}
```

### API Route Example

**Create `app/api/test-groq/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const result = await generateResponse(
      "You are a helpful AI assistant.",
      message
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 📚 Essential Resources

### Documentation to Read

1. **Next.js App Router:**
   - https://nextjs.org/docs/app
   
2. **Groq API:**
   - https://console.groq.com/docs

3. **Tailwind CSS:**
   - https://tailwindcss.com/docs

4. **Vercel Deployment:**
   - https://vercel.com/docs

### Sample Code Repositories

**Inspiration:**
- Next.js App Router examples
- AI chat applications
- Personality assessment tools
- Dating app UIs

### Communities for Help

- **Next.js Discord:** https://nextjs.org/discord
- **r/webdev:** Reddit community
- **Stack Overflow:** For specific errors
- **Groq Discord:** API-specific help

---

## 🐛 Common Issues & Fixes

### Issue 1: "Module not found: Can't resolve '@/...'"

**Solution:**
Check `tsconfig.json` has correct paths:
```json
"paths": {
  "@/*": ["./*"]
}
```

### Issue 2: Tailwind CSS not working

**Solution:**
1. Install: `npm install -D tailwindcss postcss autoprefixer`
2. Run: `npx tailwindcss init -p`
3. Configure `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
}
```

### Issue 3: Groq API errors

**Solution:**
- Verify API key is set in `.env.local`
- Check Groq console for rate limits
- Verify model name: `llama-3.1-70b-versatile`
- Check Groq status page

### Issue 4: Vercel deployment fails

**Solution:**
- Check build logs in Vercel dashboard
- Verify environment variables set in Vercel
- Ensure `package.json` has correct scripts:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## ✅ Validation Checklist

Before moving forward, verify:

**Environment:**
- [ ] Node.js v20+ installed
- [ ] npm packages installed without errors
- [ ] `.env.local` configured with Groq API key
- [ ] Git initialized and first commit made

**Development:**
- [ ] `npm run dev` starts successfully
- [ ] Landing page loads at localhost:3000
- [ ] No console errors in browser
- [ ] Tailwind CSS styles applying

**Deployment:**
- [ ] GitHub repo created and code pushed
- [ ] Vercel project connected
- [ ] Environment variables set in Vercel
- [ ] Production URL accessible

**Testing:**
- [ ] Can navigate between pages
- [ ] Groq API integration tested
- [ ] UI components render correctly
- [ ] Mobile responsive (test in DevTools)

---

## 🎯 Your First Feature

**Let's build a simple "Test Your Compatibility" page:**

**Create `app/test/page.tsx`:**
```typescript
'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function TestPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/test-groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      setAnswer(data.message);
    } catch (error) {
      setAnswer('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Test Groq Integration</h1>
        
        <div className="space-y-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a relationship question..."
            className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 text-white"
            rows={3}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={loading || !question}
          >
            {loading ? 'Thinking...' : 'Get AI Response'}
          </Button>

          {answer && (
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
              <p className="text-gray-300">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Test it:**
1. Visit `http://localhost:3000/test`
2. Ask a question
3. Verify AI response appears

---

## 🚀 What's Next?

### Option 1: Keep Building Features
Continue with the full implementation guide:
- Read `03_ANTIGRAVITY_IMPLEMENTATION.md`
- Build assessment module
- Create simulation engine
- Add results page

### Option 2: Focus on Design
Make it beautiful:
- Improve landing page
- Add animations (Framer Motion)
- Create video content
- Polish UI components

### Option 3: Marketing First
Build hype before features:
- Create waitlist page
- Set up email collection
- Start social media
- Build community

---

## 💪 You're Ready!

You now have:
- ✅ Working development environment
- ✅ Basic Next.js app structure
- ✅ Groq AI integration
- ✅ Deployed to Vercel
- ✅ First feature working

**The foundation is set. Time to build something amazing.**

---

## 📞 Get Help

**Stuck? Don't spin your wheels:**

1. Check the error message carefully
2. Search Google/Stack Overflow
3. Read relevant documentation
4. Ask in Discord/Reddit communities
5. Iterate and experiment

**Remember:** Every developer Googles things constantly. It's part of the process.

---

## 🎉 Celebrate Small Wins

- First successful deploy? 🎊
- Groq API working? 🎉
- User completed assessment? 🚀
- First viral share? 💥

Building is hard. Celebrate progress.

---

*Now stop reading and start building.*

*Document Version: 1.0*  
*Last Updated: February 11, 2026*  
*You got this: Circle13*
