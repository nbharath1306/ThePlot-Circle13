# Vercel Deployment Setup Guide

## 🚨 Critical: Environment Variables Required

Your ThePlot application requires the following environment variable to work on Vercel:

### Required Environment Variable

| Variable Name | Description | Where to Get It |
|--------------|-------------|-----------------|
| `NEXT_PUBLIC_GROQ_API_KEY` | API key for Groq AI (powers the AI partner conversations) | https://console.groq.com/keys |

## 📝 Step-by-Step Setup

### 1. Get Your GROQ API Key

1. Visit https://console.groq.com/keys
2. Sign up or log in (FREE account)
3. Click "Create API Key"
4. Give it a name (e.g., "ThePlot Production")
5. Copy the key (starts with `gsk_...`)

### 2. Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **ThePlot-Circle13**
3. Click **Settings** tab
4. Click **Environment Variables** in sidebar
5. Click **Add New**
6. Fill in:
   - **Key**: `NEXT_PUBLIC_GROQ_API_KEY`
   - **Value**: Paste your Groq API key
   - **Environments**: Select all (Production, Preview, Development)
7. Click **Save**

### 3. Redeploy

After adding the environment variable, you MUST redeploy:

**Option A: Automatic (Recommended)**
```bash
git add .
git commit -m "Add environment variable documentation"
git push
```

**Option B: Manual**
1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the three dots (...) menu
4. Click **Redeploy**
5. Confirm the redeployment

### 4. Verify

After redeployment completes:
1. Visit https://the-plot-circle13.vercel.app/matchmaker
2. Complete the questionnaire
3. Start the virtual date
4. Send a message to the AI partner
5. The AI should respond naturally (not with error messages)

## 🔍 Troubleshooting

### AI Partner Shows "Sorry, I got a bit nervous there"

**Cause**: Missing or invalid GROQ API key

**Solution**:
1. Verify the environment variable is set in Vercel
2. Check the key starts with `gsk_`
3. Make sure you selected all environments (Production, Preview, Development)
4. Redeploy after adding the variable

### Environment Variable Not Working

**Cause**: Vercel caches environment variables

**Solution**:
1. After adding/changing environment variables, you MUST redeploy
2. Simply saving the variable is not enough
3. Either push a new commit or manually redeploy

### API Key Limits

Groq free tier limits:
- **14,400 requests/day**
- Approximately **700 couples/day**
- If you hit limits, wait 24 hours or upgrade to paid tier

## 📊 Current Deployment

- **Live URL**: https://the-plot-circle13.vercel.app/
- **GitHub Repo**: https://github.com/nbharath1306/ThePlot-Circle13
- **Framework**: Next.js 16.1.6
- **Deployment**: Vercel (automatic from main branch)

## ✅ Checklist

Before going live, ensure:
- [ ] GROQ API key added to Vercel
- [ ] All three modes work (Oracle, Matchmaker, Detective)
- [ ] AI conversations respond naturally
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Environment variables set for all environments

## 🎯 Next Steps

1. Add the GROQ API key to Vercel ⬅️ **DO THIS FIRST**
2. Redeploy the application
3. Test all three modes thoroughly
4. Monitor Groq API usage
5. Consider adding analytics (optional)
