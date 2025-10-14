# 🏛️ Queen's Campus GeoGuesser

A fun, educational geography game where you guess Queen's University campus locations from real photos! Test your knowledge of campus landmarks, compete with friends on leaderboards, and learn about the beautiful Queen's University campus in Kingston, Ontario.

## 🎮 Features

- **Real campus photos** from Google Street View API
- **Interactive campus map** with clickable landmarks
- **Friends leaderboard** using Supabase (room codes + shareable URLs)
- **Difficulty levels**: Easy (5 rounds), Medium (10 rounds), Hard (15 rounds)
- **Hint system** with progressive clues for each location
- **Scoring system** based on distance from correct location
- **12+ campus landmarks** including Grant Hall, Douglas Library, Richardson Stadium, and more
- **Mobile-friendly** interface with responsive design
- **Zero-config fallbacks** - runs without API keys (with placeholder images)

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
# or
pnpm install
```

### Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your keys (all optional):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

**Without keys**: Game runs with placeholder images and no leaderboard.

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🗄️ Supabase Setup

If you want leaderboards, create a Supabase project and run this SQL:

```sql
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  room text not null,
  name text not null,
  score int not null,
  created_at timestamptz not null default now()
);

alter table scores enable row level security;

create policy "public read" on scores for select using (true);
create policy "public insert" on scores for insert with check (true);

create index on scores (room, created_at desc);
```

Then add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`.

## 🗺️ Google Maps Setup (Optional)

For real campus photos from Street View:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Street View Static API
3. Create an API key
4. Add `VITE_GOOGLE_MAPS_KEY` to `.env`

Without it, you'll get placeholder images with landmark information.

## 🚢 Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set Framework Preset: **Vite**
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MAPTILER_KEY`
5. Deploy! 🎉

Vercel will automatically build with `npm run build` and serve from `dist/`.

## 📁 Project Structure

```
/
├── index.html          # App shell with layout
├── src/
│   ├── main.js         # Bootstrap & initialization
│   ├── game.js         # Core game logic & state
│   ├── campusData.js   # Campus landmarks & scoring
│   ├── mapRenderer.js  # Interactive campus map
│   ├── streetView.js   # Google Street View integration
│   ├── ui.js           # UI management & interactions
│   ├── net.js          # Supabase integration
│   └── styles.css      # Styling
├── package.json
├── vercel.json
└── README.md
```

## 🎯 How to Play

1. Enter your name and a room code (or generate one)
2. Choose difficulty level (Easy/Medium/Hard)
3. Share the room URL with friends to compete
4. Look at the campus photo and click "Make Your Guess"
5. Click on the campus map where you think the location is
6. Use hints if needed (costs 100 points each)
7. Get points based on how close your guess is to the correct location
8. Complete all rounds and climb the leaderboard!

## 🔧 Performance & Optimization

- **Efficient map rendering** with canvas-based campus map
- **Image preloading** for smooth Street View transitions
- **LocalStorage caching** for game progress and personal bests
- **Responsive design** that works on mobile and desktop
- **Fallback images** with SVG placeholders when Street View unavailable

## 🛡️ Security Notes

Current implementation uses public RLS policies for demo purposes. For production:

- Add rate limiting on insert policy
- Validate score ranges server-side
- Add user authentication
- Implement server-side score verification

## 📜 Attribution

Campus photos via [Google Street View API](https://developers.google.com/maps/documentation/streetview)  
Campus data based on [Queen's University](https://www.queensu.ca/) public information

## 📝 License

MIT

