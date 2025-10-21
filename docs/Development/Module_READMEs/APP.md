# Module README: `app/` (Next.js Frontend)

> Summary: App Router pages and providers for wallet, theme, and query.

## Structure
- `app/page.tsx`: landing.
- `app/send/page.tsx`: send payments.
- `app/savings/page.tsx`: savings circles.
- `app/reputation/page.tsx`: reputation views.
- `app/emergency/page.tsx`: emergency UI.
- `app/qr/page.tsx`: QR utilities.
- `app/feed/page.tsx`: activity feed (events-derived).
- `app/dashboard/page.tsx`: overview.
- `app/voice/page.tsx`: experimental voice.
- `app/components/*`: UI components (TopBar, BottomNav, Footer).
- `app/providers.tsx`: Wagmi, RainbowKit, QueryClient providers.

## Dev Notes
- Reads contract addresses from env via `lib/contracts.ts`.
- RPC from `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`.
