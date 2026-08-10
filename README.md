# The Mood Bridge 💕

A private two-way interactive web app where your partner can share daily moods and send you digital hugs — with real-time push notifications and a historical mood dashboard.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Vercel KV**, and **Pushover/Telegram** notifications.

## Features

- **PIN Authentication** — Simple, secure access with session persistence via Vercel KV
- **Mood Slider** — 5-level mood input from "Meh 😕" to "Amazing 🎉" with quick-mood buttons
- **Digital Hugs** — Full-screen heart animation with push notification and 60s cooldown
- **Mood History** — Timeline, trend chart (Recharts), weekly summary, and CSV export
- **Notifications** — Pushover or Telegram Bot API integration with retry logic
- **Dark Mode** — Toggle or system preference
- **Mobile-First** — Responsive design optimized for smartphones

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter PIN `1234` (default).

> Without Vercel KV configured, the app uses an in-memory store for local development.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_PIN` | Yes | Access PIN (default: `1234` for dev) |
| `APP_PIN_HASH` | No | Pre-hashed PIN for production |
| `PIN_SALT` | No | Salt for PIN hashing |
| `PARTNER_NAME` | No | Name used in mood notifications |
| `KV_REST_API_URL` | Prod | Vercel KV / Upstash Redis URL |
| `KV_REST_API_TOKEN` | Prod | Vercel KV / Upstash Redis token |
| `PUSHOVER_USER_KEY` | No* | Pushover user key |
| `PUSHOVER_APP_TOKEN` | No* | Pushover app token |
| `TELEGRAM_BOT_TOKEN` | No* | Telegram bot token |
| `TELEGRAM_CHAT_ID` | No* | Telegram chat ID |

\* Configure either Pushover or Telegram for push notifications.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add the **Upstash Redis** integration from the [Marketplace](https://vercel.com/marketplace?category=storage&search=redis)
4. Set environment variables in the Vercel dashboard
5. Deploy — automatic on every push to `main`

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/verify` | POST | Verify PIN, create session |
| `/api/auth/logout` | POST | Destroy session |
| `/api/mood/submit` | POST | Submit mood entry |
| `/api/mood/latest` | GET | Get latest mood |
| `/api/mood/history` | GET | Get mood history |
| `/api/hug/send` | POST | Send hug + notification |
| `/api/stats/summary` | GET | Weekly/monthly summary |
| `/api/notifications/preferences` | GET/PUT | Notification toggles |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Vitest unit tests
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Login screen
│   ├── dashboard/page.tsx    # Mood slider + hug button
│   ├── history/page.tsx      # Mood history dashboard
│   └── api/                  # Serverless API routes
├── components/               # React UI components
└── lib/                      # Auth, KV, notifications, mood service
```

## License

Private project — for personal use only.
