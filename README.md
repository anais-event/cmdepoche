# CM de Poche

Ton contenu. Ton style. Autopilot.

SaaS mobile-first pour micro-influenceurs qui automatise la création et publication de contenu Instagram/TikTok.

## Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Backend**: Supabase (Auth + PostgreSQL + Storage)
- **Fonts**: Cinzel (titles), Inter (body)
- **Colors**: Crème #FAF8F5, Terracotta #B87356, Sauge #8FA37A

## Getting Started

### 1. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Create these tables:
   ```sql
   -- users
   CREATE TABLE users (
     id UUID PRIMARY KEY REFERENCES auth.users(id),
     email TEXT,
     brand_name TEXT,
     brand_desc TEXT,
     insta_handle TEXT,
     tone TEXT,
     niches TEXT[],
     frequency TEXT,
     platforms TEXT[],
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP
   );

   -- weekly_posts
   CREATE TABLE weekly_posts (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     day TEXT,
     time TEXT,
     caption TEXT,
     hashtags TEXT[],
     format TEXT,
     score INT,
     state TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- photos
   CREATE TABLE photos (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     url TEXT,
     storage_path TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- schedules
   CREATE TABLE schedules (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id),
     post_id UUID REFERENCES weekly_posts(id),
     scheduled_at TIMESTAMP,
     platform TEXT,
     status TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

### 2. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start.

## Flow

1. **Splash** → Auto-redirect to auth (2s)
2. **Login** → Sign up or sign in with email
3. **Onboarding** → 3-step form (brand info → niche → platforms)
4. **Import** → Select 3+ photos from grid
5. **Planning** → Review 3 auto-generated posts (day/time/caption)
6. **Detail** → Edit post (caption, format, hashtags)
7. **Validated** → Confirm scheduling

## MVP Features

- ✅ Authentication (email/password via Supabase)
- ✅ Onboarding form
- ✅ Photo selection
- ✅ Post generation (templates)
- ✅ Post editing (caption, format)
- ✅ Approval workflow
- 🔄 Scheduling confirmation (UI only, no real API yet)

## Phase 2 (Future)

- Real Instagram API integration (publish to feed)
- Feed analysis (detect colors, tone, optimal times)
- Analytics dashboard
- Scheduling backend (cronJob or cron.com)
- Multi-language support
- Video upload support
- Collaboration features

## Design Notes

- Mobile-first (430px max width)
- Rounded buttons (14-20px border-radius)
- Smooth transitions (0.15-0.3s)
- Crème background, terracotta accent for primary actions
- Sauge for secondary actions
- Fonts: Cinzel bold for headings, Inter regular for body

## Troubleshooting

**Auth not working?**
- Check `.env.local` has correct Supabase credentials
- Confirm email confirmation is disabled in Supabase (Auth → Settings)

**Photos not loading?**
- Unsplash URLs are used as mock in import page
- Swap with Supabase Storage path when DB integrated

**Tailwind not applying?**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server

## License

Private © 2025 CM de Poche
