# Cloudflare Pages Deployment Guide

## Prerequisites
- Cloudflare account
- Git repository connected to GitHub/GitLab
- Node.js installed locally

## Deployment Steps

### 1. Connect to Git Repository
- Push your code to GitHub/GitLab
- Make sure the repository is public or you have access rights

### 2. Deploy via Cloudflare Pages Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git**
4. Choose your repository
5. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave blank)

6. Set environment variables (if needed):
   - `GEMINI_API_KEY`: Your API key

7. Click **Save and Deploy**

### 3. Post-Deployment

After deployment, your app will be available at:
```
https://brne-project-manager.pages.dev
```

You can also:
- Add a custom domain
- Set up automatic deployments on git push
- Monitor deployment analytics

## Build Information

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: React 19 + TypeScript
- **CSS**: Tailwind CSS v4
- **Size**: ~82KB gzipped

## Data Storage

**Important**: This application uses browser localStorage for data persistence. All data is stored locally on the user's device.

- Projects, tasks, and other data are stored in IndexedDB/localStorage
- Data does NOT sync across devices
- Users should backup their data regularly
- Each browser/device has its own separate data store

## Troubleshooting

### Build Fails
- Ensure all dependencies are installed: `npm install`
- Check Node version matches package.json requirements
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### App Shows Blank Page
- Check browser console for errors (F12)
- Verify _redirects file exists in root
- Ensure dist folder was generated correctly

### Data Not Persisting
- Check if localStorage is enabled in browser
- Try clearing browser cache and refreshing
- Ensure you're using the same browser/device

## Local Testing Before Deployment

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

This will serve the production build locally on http://localhost:4173
