# Trusty Dust Frontend – Notes

- **Stack & Config**: Next.js (App Router, 16), React 19, Tailwind v4, TypeScript, RainbowKit/Wagmi (WalletConnect), Privy auth, React Query, Sonner toaster, Radix-based UI primitives (shadcn style).
- **Globals**: `src/app/layout.tsx` wraps pages with `CosmicBackground`, `Providers`; `src/app/providers.tsx` composes QueryClient, PrivyProvider, WagmiProvider, RainbowKitProvider, AuthProvider, TooltipProvider, Toaster, LoginModal; global styles in `src/css/globals.css`.
- **Lib/Helpers**: `src/lib/utils.ts` → `cn` (clsx + tailwind-merge). `src/lib/wagmi.ts` → wagmi config with WalletConnect project ID and mainnet/polygon/optimism/arbitrum/base chains.
- **Context/Hooks**:
  - `src/contexts/auth-context.tsx`: manages authentication state (Privy or RainbowKit), wallet address, modal visibility, connect/disconnect actions, and exposes `useAuth`.
  - Hooks: `use-toast` (sonner wrappers), `use-mobile` (matchMedia <=768px).
- **Pages (App Router)**:
  - `/` (`page.tsx`): dashboard feed mock (composer, posts, suggested people, applications) with `DashboardHeader` + `DashboardSidebar`.
  - `/jobs` (`jobs/page.tsx`): job listings mock, detail panel, Apply button opens `ApplyJobModal`.
  - `/jobs/add` (`jobs/add/page.tsx`): create-job form UI with dynamic requirements, salary/date fields, info/boost cards.
  - `/verify` (`verify/page.tsx`): toggle Jobs/People mode; wallet reputation analyzer mock, trust metrics/levels, people directory & suggestions.
  - `/chat` (`chat/page.tsx`): chat UI with contact list, active conversation, composer (all static data).
  - `/profile` (`profile/page.tsx`): public profile with posts and trust sidebar.
  - `/profile/edit` (`profile/edit/page.tsx`): profile edit form/portfolio inputs, tier sidebar (`ProfileSidebar`).
  - `/post` (`post/page.tsx`): feed UI; `/post/add` (`post/add/page.tsx`): composer page.
  - `not-found.tsx`: custom 404.
- **Dashboard Components** (`src/components/dashboard`):
  - `DashboardHeader`: search bar, optional filter dropdown, actions slot, login vs authenticated menu (uses `useAuth`, logout hook).
  - `DashboardSidebar`: wrapper that renders `SidebarNavCard` + `BoostTrustCard`.
  - `SidebarNavCard`: nav links (Explore/Jobs/Verify) with logo and active highlighting.
  - `BoostTrustCard`: trust score progress card.
  - `ProfileSidebar`: tier display, progress bar, growth actions.
  - `ApplyJobModal`: modal with CV/link inputs, dynamic portfolio links.
  - `LoginModal`: modal for Privy or RainbowKit login triggers.
- **General Components**:
  - Visual/layout: `CosmicBackground` (animated stars/comets), `BackgroundVideo`, `Footer`, `Navbar`, `NavLink`.
  - Cards/buttons: `GlowButton`, `FeatureCard`, `StatsCard`, `NFTCard`, `PostCard`.
- **UI Primitives** (`src/components/ui`): Radix/shadcn-style building blocks (accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form helpers, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner toaster, switch, table, tabs, textarea, toggle, toggle-group, tooltip, sidebar).
- **Aset**: `public/` holds logo/tier badges, starfield GIF/PNG, background video `Bg-TrustyDust.mp4`, favicon.
- **Scripts**: `dev`/`build`/`start` (Next + Turbopack), `lint` (eslint).

Use `useAuth` for gatekeeping UI and triggering login modal; wagmi/Privy env vars: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_PRIVY_APP_ID`.

## Performance tweaks (Feb 2025)
- `CosmicBackground`: reduced star/comet counts (320 stars, 4 comets) to shrink DOM/animation load.
- Feed/chat/profile/post pages: external Unsplash images now include `?auto=format&fit=crop&w=640&q=60` to force compression/resizing and lower bandwidth.
- Hydration fix: `CosmicBackground` now uses deterministic PRNG (seeded) to align SSR/CSR output.
- WalletConnect/Privy/Wagmi SSR fix: providers bundle now wrapped in `ProvidersWrapper` (client-only, `ssr: false`) to avoid `indexedDB` access on server.
- Wagmi config now lazy (`getWagmiConfig`) to prevent WalletConnect initialization during SSR; `Providers` grabs config via `useMemo` on client.
