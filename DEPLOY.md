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

## Capacity
- **Unlimited couples** ✅
- **Zero cost** ✅
- **Works offline** ✅

The only limit is Groq's free tier (14,400 requests/day = ~700 couples/day).
