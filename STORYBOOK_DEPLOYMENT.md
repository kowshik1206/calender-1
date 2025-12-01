# 🚀 Storybook Deployment Guide

## Option 1: Chromatic (Recommended - Free for Open Source)

Chromatic is the official Storybook deployment platform with visual testing.

### Steps:

1. **Sign up for Chromatic**
   - Go to [chromatic.com](https://www.chromatic.com/)
   - Sign in with your GitHub account
   - Select your repository: `kowshik1206/Calender-`

2. **Get your project token**
   ```bash
   # Install Chromatic
   npm install --save-dev chromatic
   
   # Deploy Storybook
   npx chromatic --project-token=<your-project-token>
   ```

3. **Automated deployment** (GitHub Actions)
   
   Create `.github/workflows/chromatic.yml`:
   ```yaml
   name: 'Chromatic'
   on: push

   jobs:
     chromatic:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
           with:
             fetch-depth: 0
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
   ```

4. **Add token to GitHub Secrets**
   - Go to repository Settings → Secrets → Actions
   - Add `CHROMATIC_PROJECT_TOKEN` with your token

5. **Get your live URL**
   - Your Storybook will be at: `https://your-project-id.chromatic.com`

---

## Option 2: Vercel (Fast & Easy)

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build Storybook**
   ```bash
   npm run build-storybook
   ```

3. **Deploy**
   ```bash
   cd storybook-static
   vercel --prod
   ```

4. **Or use Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `npm run build-storybook`
   - Set output directory: `storybook-static`
   - Deploy!

---

## Option 3: Netlify

### Steps:

1. **Build Storybook**
   ```bash
   npm run build-storybook
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --dir=storybook-static --prod
   ```

3. **Or use Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop `storybook-static` folder
   - Or connect your GitHub repository
   - Set build command: `npm run build-storybook`
   - Set publish directory: `storybook-static`

---

## Option 4: GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy-storybook": "npm run build-storybook && gh-pages -d storybook-static"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy-storybook
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: `gh-pages` branch
   - Your Storybook will be at: `https://kowshik1206.github.io/Calender-/`

---

## ✅ After Deployment

1. **Update README.md**
   - Replace placeholder with your live Storybook URL
   - Example: `https://65abc123.chromatic.com` or `https://calendar-storybook.vercel.app`

2. **Test the deployment**
   - Visit your live URL
   - Check all 23 stories load correctly
   - Test interactions (buttons, theme toggle, etc.)

3. **Add to Internshala submission**
   - Copy your live Storybook URL
   - Paste it in the submission form
   - Also include your GitHub repo URL

---

## 📊 What Reviewers Will See

Your deployed Storybook will showcase:
- ✅ 23 interactive component demos
- ✅ All calendar features (Month/Week views, Events, etc.)
- ✅ Advanced features (Search, Filters, Stats, Drag-drop, Theme toggle)
- ✅ Component documentation
- ✅ Interactive controls to modify props
- ✅ Responsive design previews
- ✅ Accessibility features

---

## 🎯 Recommended: Chromatic

**Why Chromatic is best:**
- ✅ Official Storybook platform
- ✅ Visual regression testing
- ✅ Free for open source projects
- ✅ Automatic deployments on every push
- ✅ Professional URL
- ✅ Component history and versioning

**Quick Chromatic Setup:**
```bash
npx chromatic --project-token=<your-token>
```

Then add the URL to your README and Internshala submission!

---

## 🆘 Need Help?

If you encounter issues:
1. Check the build output: `npm run build-storybook`
2. Ensure `storybook-static` folder is created
3. Make sure all dependencies are installed
4. Check platform documentation (Chromatic/Vercel/Netlify docs)

---

**Current Status:** Storybook is built and ready in `storybook-static/` folder! 🎉
Just choose a deployment platform and follow the steps above.
