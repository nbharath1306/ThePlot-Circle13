# Vercel Deployment Setup Guide

## 🚨 Critical: Services Required

Your ThePlot application requires **two** services to work properly on Vercel:
1. **Groq AI** (for text generation)
2. **Vercel KV** (Redis) (for multiplayer session synchronization)

Without Vercel KV, multiplayer modes will get stuck on "Waiting for partner..." because Vercel functions are stateless.

### Required Environment Variables

| Variable Name | Description | Where to Get It |
|--------------|-------------|-----------------|
| `NEXT_PUBLIC_GROQ_API_KEY` | API key for Groq AI | https://console.groq.com/keys |
| `KV_REST_API_URL` | Vercel KV URL | Vercel Dashboard -> Storage |
| `KV_REST_API_TOKEN` | Vercel KV Token | Vercel Dashboard -> Storage |

## 📝 Step-by-Step Setup

### 1. Get Your GROQ API Key

1. Visit https://console.groq.com/keys
2. Sign up or log in (FREE account)
3. Click "Create API Key"
4. Give it a name (e.g., "ThePlot Production")
5. Copy the key (starts with `gsk_...`)

### 2. Configure Vercel KV (Storage)

1. Go to https://vercel.com/dashboard/
2. Select your project: **ThePlot-Circle13**
3. Click the **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Click **Create** (Tier: Hobby/Free)
7. Select **Regions**: Choose one close to you (e.g., Washington, D.C. - iad1)
8. Click **Create**
9. **IMPORTANT**: In the "Connect to Project" step, verify your project is selected and click **Connect**.
   - This automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your environment variables.

### 3. Add Groq API Key

1. Go to **Settings** -> **Environment Variables**
2. Click **Add New**
3. Key: `NEXT_PUBLIC_GROQ_API_KEY`
4. Value: Paste your Groq Key
5. Environments: Production, Preview, Development
6. Click **Save**

### 4. Redeploy

After adding storage and env vars, you MUST redeploy for changes to take effect:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (...) menu
4. Click **Redeploy**
5. Confirm

## 🔍 Troubleshooting

### "Waiting for Partner..." Stuck

**Cause**: Missing Vercel KV (Redis) database.
**Explanation**: On Vercel, the file system is temporary. Without a database, User A's "I'm done" signal is saved to a temporary file that User B cannot see.
**Solution**: Create and link a Vercel KV database as described in Step 2.

### AI Partner Shows "Sorry, I got a bit nervous there"

**Cause**: Missing or invalid GROQ API key.
**Solution**: Check your `NEXT_PUBLIC_GROQ_API_KEY` in Vercel settings.

## 📊 Current Deployment

- **Live URL**: https://the-plot-circle13.vercel.app/
- **GitHub Repo**: https://github.com/nbharath1306/ThePlot-Circle13
- **Framework**: Next.js 16.1.6
- **Storage**: Vercel KV (Redis)
- **AI**: Groq (Llama 3 via API)
