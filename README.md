# The Art of Friendship
## Deployment Guide — GitHub Pages via GitHub Actions

A UDL-compliant, trauma-informed social-emotional learning app.  
Triple-profile design: ASD · PTSD · ADHD  
Developed by Catrina Wright, MAT

---

## What This App Contains

| Module | Contents |
|--------|----------|
| My Reference | All 17 framework definitions — three representation layers each (text, visual metaphor, audio), domain-filtered search, rule cards, framework map |
| Before I Communicate | Pre-communication checklist — 5 sequential questions, activated mode, traffic light output, AI-powered preparation |
| My Tracker | Self-audit (3 formats), skill tracker, Rule I Applied Today log, initiation tracker, bilateral journal, relationship health check |
| Practice | 8 bilateral scenario cards, rule trivia (3 tiers), flashcard deck (17 terms), AI scenario generator |

Universal features on every screen: regulation state bar, emergency screen, grounding pause, display settings (font size, contrast, reduced visual, activated mode).

---

## Prerequisites

Before you begin, you need:
- A GitHub account
- Git installed on your computer ([git-scm.com](https://git-scm.com))
- Node.js 20 or later ([nodejs.org](https://nodejs.org)) — only needed for local development

---

## Step 1 — Create a New GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Set the repository name to exactly: `art-of-friendship`
3. Set visibility to **Public** (GitHub Pages requires public repos on free plans)
4. Do NOT initialize with README, .gitignore, or license — you will push the existing files
5. Click **Create repository**

---

## Step 2 — Push the Project to GitHub

Open a terminal in the `art-of-friendship/` folder and run:

```bash
git init
git add .
git commit -m "Initial deploy: Art of Friendship app"
git branch -M main
git remote add origin https://github.com/catrinawright/art-of-friendship.git
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages (via GitHub Actions)

1. In your new repository, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

That is all. The `deploy.yml` workflow file in `.github/workflows/` handles everything else automatically.

---

## Step 4 — Trigger the First Deployment

Push any change to the `main` branch (or manually trigger the workflow):

1. Go to the **Actions** tab in your repository
2. Click **Deploy Art of Friendship to GitHub Pages**
3. Click **Run workflow → Run workflow**

The first build takes 2–3 minutes. Subsequent pushes deploy in under 60 seconds.

---

## Step 5 — Confirm the Deployment

After the workflow completes (green checkmark in the Actions tab), open:

```
https://catrinawright.github.io/art-of-friendship/
```

The app will be live.

---

## Enabling the AI Scenario Generator (Optional)

The AI Scenario Generator in Module 4 uses the Anthropic API. Without a key, it falls back automatically to a template-based scenario generator that works without any network call.

To enable the full AI feature:

### 5a — Create an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create a new API key
3. Set a monthly usage limit (recommended: $5–10/month for a single-user app)
4. Copy the key — you will only see it once

### 5b — Add the Key as a GitHub Secret

1. In your repository, go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `VITE_ANTHROPIC_API_KEY`
4. Value: paste your API key
5. Click **Add secret**

### 5c — Redeploy

Push a small change to `main` (or trigger the workflow manually) to rebuild with the key injected.

> **Security note:** The API key is injected at build time into the JavaScript bundle.  
> Because this is a public repository, the key will be visible in the built files.  
> Protect it by setting strict usage limits in the Anthropic console and restricting  
> the key to this application only. For a single-user private app, this is acceptable risk.

---

## Local Development

To run the app locally before deploying:

```bash
# Install dependencies (first time only)
npm install

# Copy environment variable template
cp .env.example .env
# Edit .env and add your API key if testing the AI generator locally

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/art-of-friendship/`

---

## Updating the App

After making changes:

```bash
git add .
git commit -m "Description of what changed"
git push origin main
```

GitHub Actions rebuilds and redeploys automatically within 60 seconds.

---

## Customizing the Content

All framework content lives in `src/App.jsx` as JavaScript constants near the top of the file:

| Constant | Contains |
|----------|----------|
| `TERMS` | All 17 definitions (plain, definition, boundary, rule anchor, metaphor, audio text, activation prompt) |
| `RULE_CARDS` | 4 clustered rule card sets |
| `SCENARIOS` | 8 pre-built bilateral practice scenarios |
| `TRIVIA_Q` | 12 trivia questions across 3 tiers |
| `AUDIT_Q` | 5 self-audit questions with sentence frames and word banks |
| `HEALTH_CRITERIA` | 5 relationship health check criteria |
| `RULES_SIMPLE` | All 13 rules (used by skill tracker and practice tools) |

To add a new scenario, append a new object to the `SCENARIOS` array following the existing structure.

---

## File Structure

```
art-of-friendship/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions deployment pipeline
├── public/
│   └── manifest.json           ← PWA manifest (home screen installation)
├── src/
│   ├── App.jsx                 ← Complete application (all screens, logic, data)
│   └── main.jsx                ← React DOM entry point
├── .env.example                ← Environment variable template (commit this)
├── .gitignore                  ← Excludes .env and node_modules
├── index.html                  ← HTML entry point with mobile viewport
├── package.json                ← Dependencies
├── README.md                   ← This file
└── vite.config.js              ← Build configuration
```

---

## Adding to the Home Screen (Mobile)

Once deployed, the app can be installed to a phone's home screen:

- **iOS Safari:** Share → Add to Home Screen
- **Android Chrome:** Menu → Add to Home Screen

This gives the app a dedicated icon and full-screen mode (no browser chrome).

---

## License

All framework content and tool design: CC BY-NC 4.0  
Catrina Wright, MAT — catrinawright.github.io  
June 2026
