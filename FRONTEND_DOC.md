# ShopFresherz Frontend Documentation

## Overview

ShopFresherz is a Next.js App Router frontend for a Nigerian tech ecommerce store. The application covers the public storefront, product browsing, product detail pages, cart, checkout with Flutterwave payment initiation, authenticated customer account pages, and a protected admin dashboard.

The root `/` page redirects to `/store`. Customer-facing pages use a storefront layout with top bar, navbar, footer, cart drawer, and chat widget. Account and admin areas add client-side role protection with loading states while persisted auth state hydrates.

## Tech Stack

- Framework: Next.js `16.2.3` with App Router
- Runtime UI: React `19.2.4`
- Language: TypeScript with `strict` enabled
- Styling: Tailwind CSS v4 via `@import "tailwindcss"` in `src/app/globals.css`
- Server state: `@tanstack/react-query`
- Client state: Zustand, with persistence for auth and cart
- Forms/validation: `react-hook-form`, `@hookform/resolvers`, `zod`
- Auth helpers: email/password, Google OAuth, access/refresh token storage
- Payments: `flutterwave-react-v3`
- Charts: Recharts
- Media: Next Image, Cloudinary upload/delete helpers
- Icons: `react-icons`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Required Environment Variables

Create a local `.env.local` with the values required by the frontend and Next API route:

```bash
NEXT_PUBLIC_API_URL=https://your-api.example.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

`NEXT_PUBLIC_API_URL` is used by `src/lib/api/client.ts` and direct favorites calls. `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is required by the root provider. Cloudinary values are used by upload utilities and the local `POST /api/cloudinary/delete` route.

## Application Structure

```text
src/
  app/                  Next.js App Router pages, layouts, metadata, globals
  components/
    ui/                 Shared reusable UI primitives
    layout/             Public storefront chrome
    admin/              Admin dashboard shell, modals, settings widgets
    account/            Account-specific modal components
  features/
    product/            Storefront product listing, cards, PDP, filters
    cart/               Cart drawer and cart item UI
    checkout/           Checkout flow steps and shared checkout types
    payment/            Flutterwave trigger wrapper
    auth/               Login/register/OTP auth UI
    account/            Account layout and order/payment widgets
    chat/               Chat widget
  lib/
    api/                Backend API wrappers and one local API route
    hooks/              Cross-feature hooks
    types/              Shared TypeScript domain types
    utils/              Formatting, class merging, product/cloudinary helpers
  store/                Zustand stores for auth, cart, UI, toast, confirm dialog
```

## Routing Map

### Public Storefront

- `/` redirects to `/store`
- `/store` is the storefront home page
- `/store/shop` lists products using `productsApi.list`
- `/store/category/[slug]` handles category browsing
- `/store/product/[slug]` renders the product detail page with ISR and product metadata
- `/store/search` handles product search
- `/store/wishlist` shows favorites/wishlist
- `/store/need-help` and `/store/support` provide support pages
- `/cart` shows the cart page
- `/store/checkout` runs the checkout flow
- `/store/checkout/confirmation` displays order confirmation

### Authentication

- `/auth/login`
- `/auth/register`
- `/auth/email-verification`
- `/auth/forget-password`
- `/auth/reset-password`

### Customer Account

These pages are protected by `useRequireAuth({ role: "Customer", redirectTo: "/" })` in `src/app/account/layout.tsx`.

- `/account`
- `/account/profile`
- `/account/orders`
- `/account/order-detail/[orderNumber]`
- `/account/addresses`
- `/account/payment-methods`
- `/account/notifications`
- `/account/loyalty`
- `/account/referrals`
- `/account/reviews`
- `/account/track`

### Admin Dashboard

These pages are protected by `useRequireAuth({ role: "SuperAdmin", redirectTo: "/" })` in `src/app/admin/dashboard/layout.tsx`. The guard accepts both `Admin` and `SuperAdmin` as admin roles internally.

- `/admin/dashboard`
- `/admin/dashboard/analytics`
- `/admin/dashboard/orders`
- `/admin/dashboard/products`
- `/admin/dashboard/categories`
- `/admin/dashboard/customers`
- `/admin/dashboard/inventory`
- `/admin/dashboard/reviews`
- `/admin/dashboard/coupons`
- `/admin/dashboard/flash-deals`
- `/admin/dashboard/content`
- `/admin/dashboard/settings`

## Layouts and Providers

`src/app/layout.tsx` is intentionally minimal. It sets the Inter font, metadata, and mounts `Providers`.

`src/app/providers.tsx` mounts:

- React Query `QueryClientProvider`
- Google OAuth provider
- `useSessionManager()` for proactive token refresh
- global `Toaster`
- global `ConfirmDialog`

Storefront pages mount shared chrome in `src/app/store/layout.tsx`:

- `TopBar`
- `Navbar`
- page content
- `Footer`
- `CartDrawer`
- `ChatWidget`

Auth and account layouts use similar storefront chrome. Admin pages use the admin sidebar, admin navbar, and `SidebarProvider`.

## API Layer

The main API wrapper lives in `src/lib/api/client.ts`.

Responsibilities:

- Builds URLs from `NEXT_PUBLIC_API_URL`
- Adds `Content-Type: application/json`
- Adds `Authorization: Bearer <token>` when a token is passed
- Adds query parameters from `params`
- Parses JSON responses
- Returns `undefined` for `204 No Content`
- Throws normalized API errors with `{ code, message, status }`
- On authenticated `401`, refreshes the access token once and retries the original request

API modules:

- `auth.ts`: login, register, logout, refresh, me, forgot/reset password, Google login
- `products.ts`: product listing/search, PDP lookup, related products, promotions, categories, brands, flash deals
- `account.ts`: dashboard, profile, addresses, payment methods, orders, loyalty, notifications, reviews
- `checkout.ts`: place order, initiate payment, confirm order
- `admin.ts`: dashboard stats, users, orders, analytics, settings, inventory, banners, promotions, products, categories, coupons, flash deals, reviews, notifications
- `favorites.ts`: wishlist/favorites using direct `fetch`
- `chatbot.ts`: chatbot message endpoint
- `cloudinary/delete/route.ts`: local Next route for deleting Cloudinary assets

`cart.ts` and `orders.ts` currently exist but are empty.

## Auth and Session Flow

Auth state is stored in `src/store/auth.ts` using Zustand persist under the `sf-auth` key.

Persisted auth fields:

- `user`
- `accessToken`
- `refreshToken`
- `expiresAt`
- `isAuthenticated`

Important helpers:

- `setAuth()` saves user and token payload after login/register/Google auth
- `setTokens()` updates refreshed tokens
- `logout()` clears local auth state
- `isAdmin()` returns true for `Admin` or `SuperAdmin`
- `redirectPath()` sends admins to `/admin/dashboard` and customers to `/store`

`useSessionManager()` runs once at the app root and schedules a refresh one minute before token expiry. `apiFetch()` also handles reactive refresh when a protected API call returns `401`.

`useRequireAuth()` waits for Zustand hydration, redirects unauthenticated users, and enforces customer/admin route separation.

## State Management

Zustand stores:

- `auth.ts`: persisted authentication/session state
- `cart.ts`: persisted cart items, coupon, discount, and non-persisted drawer state
- `ui.ts`: mobile menu, search, and category menu visibility
- `toast.ts`: global toast queue plus convenience helpers
- `confirm.ts`: promise-based global confirmation dialog

React Query is used for server data in areas like checkout saved cards/addresses and admin dashboard data. The default query config uses a one-minute stale time, one retry, and no refetch on window focus.

## Cart and Checkout

Cart data is client-side and persisted under `sf-cart`.

Cart line items are keyed by product and variant. Quantity updates are clamped by stock quantity. Coupon state is also stored in the cart store.

Checkout at `/store/checkout` is a client-side multi-step flow:

1. Registered checkout summary
2. Delivery step
3. Payment step
4. Review step

The checkout page loads saved addresses and cards when an access token is available. It currently supports local coupon codes (`SAVE10`, `FRESH10`, `WELCOME5000`) and computes delivery fee, tax, and total client-side.

Payment flow:

1. `checkoutApi.initiatePayment()` creates a pending order/payment session.
2. The Flutterwave config is passed to `FlutterwavePaymentTrigger`.
3. On payment success, `checkoutApi.confirmOrder()` confirms the order.
4. The cart is cleared.
5. The user is redirected to `/store/checkout/confirmation?orderNumber=...`.

## Product and Storefront Flow

`productsApi` normalizes backend product data for the UI. It maps backend pagination `items` into `data`, flattens brand/category names onto product records, and maps `availableQty` into `stockQty` where needed.

Product detail pages use:

- `generateMetadata()` for SEO title, description, and Open Graph image
- `revalidate = 120`
- `productsApi.getBySlug(slug)`
- Cloudinary URL transformation for thumbnail, display, and zoom image variants
- supporting product rows from flash deals, best sellers, top-rated listing, and new arrivals

The shop page uses `revalidate = 60`, fetches a best-selling product list, and passes initial products to `ShopClient`.

## Admin Area

The admin dashboard is a client-rendered area protected at layout level. Data comes from `adminApi` and feature hooks such as `useDashboard()` and `useLowStock()`.

The admin API layer covers:

- dashboard metrics
- analytics
- orders and status updates
- customers and loyalty adjustment
- products and categories
- inventory low-stock alerts
- reviews
- coupons
- flash deals
- settings sections
- banners and promotional content
- notifications

Some dashboard chart/logistics data is currently mocked in `src/app/admin/dashboard/page.tsx` because the backend does not provide those breakdowns yet.

## Styling and Design Tokens

Global styles live in `src/app/globals.css`.

Key CSS variables:

- `--color-primary: #F5820A`
- `--color-primary-dark: #E06B00`
- `--color-secondary: #0D0D0D`
- `--color-accent: #7B2FBE`
- `--color-surface: #F5F5F5`
- `--color-success: #22C55E`
- `--color-danger: #EF4444`
- `--color-warning: #F59E0B`
- `--color-border: #E5E7EB`

The app uses Tailwind utility classes heavily, with shared UI primitives in `src/components/ui`.

## Images and Assets

Static assets live under `public/`.

Important folders:

- `public/icons`: ShopFresherz logo variants
- `public/images`: product/category/promo placeholder images
- `public/images/categories`: category artwork

Next Image allows remote assets from:

- `placehold.net`
- `res.cloudinary.com`
- `images.unsplash.com`

Cloudinary upload helper:

- `src/lib/utils/cloudinary.ts`
- uses upload preset `shopfresherz`

Cloudinary delete helper:

- client utility calls `/api/cloudinary/delete`
- Next route uses Cloudinary server credentials

## Development Conventions

- Use the `@/*` alias for imports from `src`.
- Put route files in `src/app`.
- Put reusable UI in `src/components/ui`.
- Put domain-specific UI in `src/features/<domain>`.
- Put backend calls in `src/lib/api`.
- Put shared API/domain types in `src/lib/types` or next to the API module when they are endpoint-specific.
- Use `api` from `src/lib/api/client.ts` for authenticated backend calls so token refresh and error normalization stay consistent.
- Use Zustand stores for cross-page UI/session/cart state.
- Use React Query for server state that benefits from caching, loading, and refetch behavior.

## Known Gaps and Notes

- `README.md` is still the default Next.js README.
- `src/lib/api/cart.ts`, `src/lib/api/orders.ts`, and several hook files are empty placeholders.
- Some source files contain mojibake characters in comments or UI strings, likely from an encoding issue.
- Account route protection requests role `"Customer"`, while admin route protection requests `"SuperAdmin"`. The guard treats `Admin` and `SuperAdmin` as admin roles for redirects.
- Favorites uses direct `fetch` instead of the shared `api` wrapper, so it does not get automatic token refresh.
- Checkout coupon validation is currently hardcoded client-side.
- Some admin dashboard visual data is mocked until matching backend endpoints exist.
- No dedicated test suite is configured in `package.json`; available verification commands are lint and build.

## Suggested Verification Before Release

```bash
npm run lint
npm run build
```

Also manually verify:

- Login, register, Google login, logout
- Token refresh after an idle session
- Product listing, search, category, and PDP pages
- Add to cart, cart persistence, checkout, Flutterwave success/cancel paths
- Account pages with a customer user
- Admin pages with an admin or super admin user
- Cloudinary upload/delete in admin content/product flows
