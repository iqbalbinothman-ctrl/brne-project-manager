# Supabase Setup Instructions for BRNE Project Manager

Your `.env.local` file is already created with Supabase credentials. Now you need to:

## Step 1: Create Database Tables in Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy and paste the SQL from `supabase_migrations.sql` or `supabase/migrations/20250513_init.sql`
5. Click **Run**

This creates:
- `users` table (user profiles)
- `projects` table (your projects)
- `tasks` table (project tasks)
- Row Level Security (RLS) policies (data stays private)

## Step 2: Test the App

App is running at **http://localhost:3002**

1. Click **"Don't have an account? Sign up"**
2. Enter your email and password
3. Enter your name
4. Click **Create Account**
5. Check your email to confirm your account
6. Come back and sign in with your email/password

## Step 3: Create a Project

Once logged in:
1. Click **Projects** in the sidebar
2. Click **+ New Project**
3. Fill in project details
4. Click **Save**

**Your project will be saved to Supabase** and visible across all your devices!

## Step 4: Invite Team Members

Team members can:
1. Go to http://localhost:3002 (when you deploy) or http://your-domain.com
2. Sign up with their own email
3. Their own projects will appear (separate from yours)
4. To share projects: Coming soon (team collaboration feature)

## Environment Variables

Your `.env.local` file contains:
```
VITE_SUPABASE_URL=https://fwveqnghphjmkfbmwofg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_CHrEqH5KlcdIkjULKfBSOw_DTHojmae
```

⚠️ **Never commit `.env.local` to git** - it's already in `.gitignore`

## Data Sync

✅ **Local changes** → Synced to Supabase automatically
✅ **Supabase changes** → Loaded in real-time
✅ **Multiple devices** → All see updates instantly

## Deployment to Cloudflare Pages

When ready:

```bash
npm run build
npx wrangler pages deploy dist/
```

Or push to GitHub and connect to Cloudflare Pages for auto-deploy.

Environment variables on Cloudflare:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

**Ready to test?** Go to http://localhost:3002 after setting up the database!
