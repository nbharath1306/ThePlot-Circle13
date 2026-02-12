# ThePlot - Zero-Cost Deployment

## 🎉 100% FREE Forever

This app uses **zero backend** - everything runs in the browser!

### How It Works
1. **Person A** creates session → Gets shareable link + QR code
2. **Person B** scans/clicks link → Opens on their device
3. Both answer questions → Stored in **their own browser** (localStorage)
4. When both finish → They click "Check if Partner is Ready"
5. Both see "Ready" → Start simulation together

### Technology
- ✅ **No database** (localStorage only)
- ✅ **No backend** (pure client-side)
- ✅ **QR codes** (generated in browser)
- ✅ **Unlimited users** (no server limits)

## Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables
Only need one:
- `GROQ_API_KEY` (for AI simulation)

That's it! No Redis, no database, no costs.


## 💰 Feasibility & Cost Analysis (Free Tier)

This project is designed to run 100% on free tiers. Here is the breakdown:

### 1. Vercel KV (Database) - Free "Hobby" Tier
- **Cost**: $0/month.
- **Storage**: 256 MB (Enough for ~50,000+ sessions).
- **Requests**: 30,000 requests/day.
- **Capacity**:
  - Each couple generates ~50-100 database requests (polling while waiting).
  - **Max Capacity**: ~300-500 couples per day.
  - **Impact**: Does **not** affect your other Vercel projects unless you exceed the *account-wide* limit.

### 2. Groq API (AI) - Free Public Beta
- **Cost**: $0/month.
- **Limits**:
  - ~14,400 requests/day.
  - ~30 requests/minute.
- **Capacity**:
  - A simulation runs ~10 turns.
  - **Max Capacity**: ~1,000+ simulations per day.
- **Impact**: Completely separate from Vercel. If you hit the limit, the AI just pauses for a moment.

### 3. Verdict
- **Is it feasible?** YES.
- **Will it charge me?** NO. Both services utilize hard limits on their free tiers (they stop working rather than charging you).
- **Can I scale?** For a viral launch (10k+ users), you would need to upgrade Vercel ($20/mo). For personal/portfolio use, it is effectively unlimited.

