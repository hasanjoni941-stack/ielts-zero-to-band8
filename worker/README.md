# AI IELTS Writing Tutor — setup guide (free-first)

This repository is hosted on GitHub Pages. GitHub Pages is static hosting, so **never put an AI API key in browser JavaScript**. The tutor page calls a small Cloudflare Worker; the Worker uses a Cloudflare Workers AI binding so there is no key to expose.

## What is included
- `../ai-tutor.html`: writing tutor page with AI feedback UI and an offline checklist fallback.
- `index.js`: Cloudflare Worker endpoint at `POST /api/feedback`.
- Model: `@cf/meta/llama-3.1-8b-instruct`.
- CORS is restricted to `https://hasanjoni941-stack.github.io`.
- Input length is limited to 8,000 characters.

## Deploy the free-first Worker

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and open **Workers & Pages**.
2. Create a Worker (choose the option to create/deploy a Worker).
3. In the Worker editor, replace the starter code with the full contents of this folder's `index.js`.
4. Open the Worker **Settings → Bindings** (sometimes shown as **Bindings**). Add an **AI** binding named exactly `AI`, then save and deploy.
5. Copy the Worker URL, for example `https://your-worker.your-subdomain.workers.dev`. Do not copy a made-up example; use the URL Cloudflare actually gives you.
6. Open the GitHub Pages website and click **AI Writing Tutor** or visit `/ielts-zero-to-band8/ai-tutor.html`.
7. Paste the real Worker URL into the Worker URL field and click **URL সেভ করো**.
8. Write a short test essay and click **AI feedback নাও**.

## Important notes
- The Worker checks the site origin and only accepts the configured GitHub Pages origin. If you later change GitHub username or add a custom domain, update `allowedOrigin` in `index.js`, then redeploy.
- Free allocations and model availability can change. Check [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) and [Workers limits](https://developers.cloudflare.com/workers/platform/limits/).
- The endpoint has basic input validation but is not a full production abuse-prevention system. Before inviting many users, consider Cloudflare rate limiting/Turnstile and monitoring.
- Writing text is sent to the AI provider for feedback. Ask students not to include personal or sensitive information.
- AI feedback is practice guidance, not an official IELTS score or guarantee.
