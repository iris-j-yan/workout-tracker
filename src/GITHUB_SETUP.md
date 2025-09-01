# 🚀 GitHub Setup & Deployment Guide

## Step 1: Prepare Your Project

### Create a `.gitignore` file
Create a file called `.gitignore` in your project root:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
```

### Create a `package.json` file
If you don't have one, create this file in your project root:

```json
{
  "name": "workout-tracker",
  "version": "1.0.0",
  "description": "A beautiful workout tracking app with analytics and progress monitoring",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "recharts": "^2.8.0",
    "motion": "^10.16.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "tailwindcss": "^4.0.0"
  },
  "keywords": [
    "workout",
    "fitness",
    "tracker",
    "react",
    "typescript",
    "pwa",
    "analytics"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

## Step 2: Initialize Git Repository

Open your terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Workout Tracker App with PWA functionality"
```

## Step 3: Create GitHub Repository

1. **Go to [GitHub.com](https://github.com)** and sign in
2. **Click the "+" icon** in the top right → "New repository"
3. **Repository name**: `workout-tracker` (or your preferred name)
4. **Description**: "Beautiful workout tracking app with analytics and PWA support"
5. **Set to Public** (so you can use GitHub Pages for free)
6. **DON'T initialize** with README, .gitignore, or license (you already have them)
7. **Click "Create repository"**

## Step 4: Connect Local Repository to GitHub

Copy the commands from your new GitHub repository page, they'll look like:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/yourusername/workout-tracker.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Set Up GitHub Pages for Deployment

### Option A: Using GitHub Pages (Free)

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll to "Pages"** in the left sidebar
4. **Source**: Select "GitHub Actions"
5. **Create a deployment workflow**:

Create `.github/workflows/deploy.yml` in your project:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

6. **Commit and push** this workflow file
7. **Your app will be available** at: `https://yourusername.github.io/workout-tracker`

### Option B: Using Netlify (Recommended - Easier)

1. **Go to [Netlify.com](https://netlify.com)** and sign up
2. **Click "Add new site"** → "Import an existing project"
3. **Connect your GitHub** account
4. **Select your workout-tracker repository**
5. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Click "Deploy site"**
7. **Your app will be live** at a URL like: `https://amazing-app-name.netlify.app`

## Step 6: Update Your App URL

Once deployed, update the README.md with your live app URL:

```bash
# Edit README.md and replace the placeholder with your actual URL
git add README.md
git commit -m "Add live app URL to README"
git push
```

## Step 7: Test on Your Phone

1. **Open your live app URL** on your phone
2. **Look for the PWA install prompt**
3. **Add to home screen** for the full native app experience
4. **Test offline functionality** by turning off wifi

## 🎉 You're Done!

Your workout tracker is now:
- ✅ **Published on GitHub** for version control
- ✅ **Deployed and accessible** via URL
- ✅ **Installable on mobile** as a PWA
- ✅ **Automatically updates** when you push changes

## 📱 Next Steps

### To update your app:
```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push
```

Your app will automatically redeploy with the changes!

### To add new features:
1. Create a new branch for features
2. Make changes and test
3. Create a pull request
4. Merge to main when ready

## 🛠️ Troubleshooting

### App not loading?
- Check the browser console for errors
- Ensure your build command works locally: `npm run build`
- Verify the publish directory is correct (`dist` for Vite)

### PWA not installing?
- Make sure you're using HTTPS (automatic with GitHub Pages/Netlify)
- Check that `manifest.json` and `sw.js` are accessible
- Try in Chrome or Safari (best PWA support)

### Want a custom domain?
- **Netlify**: Add custom domain in site settings
- **GitHub Pages**: Add CNAME file to your repository

---

**Your workout tracker is now live and ready to help you crush your fitness goals!** 💪