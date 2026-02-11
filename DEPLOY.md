# ThePlot - Deployment Guide

## Quick Deploy to Vercel

### 1. Set up Upstash Redis (Free)
1. Go to [upstash.com](https://upstash.com)
2. Create a free account
3. Create a new Redis database
4. Copy the REST URL and Token

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Add Environment Variables in Vercel
Go to your Vercel project settings and add:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `GROQ_API_KEY`

### 4. Redeploy
```bash
vercel --prod
```

## Features
- ✅ Multi-user sessions with unique links
- ✅ QR code generation for easy sharing
- ✅ Real-time session synchronization
- ✅ Automatic session expiry (1 hour)
- ✅ Handles unlimited concurrent couples

## How It Works
1. User A creates a session → Gets unique link + QR code
2. User A shares link/QR on WhatsApp
3. User B scans/clicks → Joins session
4. Both answer questions simultaneously
5. When both finish → Simulation starts

## Local Development
For local dev without Redis, the app falls back to localStorage.
