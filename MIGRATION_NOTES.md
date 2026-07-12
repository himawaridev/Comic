# Migration notes

## Current repo inspection

- `frontend` is already a Next.js App Router app, but it still had legacy React-style UI modules, Ant Design wiring, React Router exports, and garbled Vietnamese strings.
- `backend` remains an Express service using Sequelize models for the existing crawler tables and routes such as `/getTruyenHotController`, `/getTruyenTienHiepController`, `/getTruyenKiemHiepController`, `/getTruyenMoiCapNhatController`, and `/getTheLoaiTruyenController`.
- The existing data shape is preserved on the frontend through `src/lib/comic-data.ts`, which adapts legacy fields like `Title`, `ImageLinks`, `Author`, `Chapters`, and `LinkComic`.

## UI migration completed

- Replaced the global app shell with a mobile-first comic app layout inspired by the supplied template.
- Added a drawer menu, sticky header, bottom navigation, modern card/list layouts, detail page, reader page, auth/profile/favorites/history/search/genres screens.
- Added responsive desktop layouts with max-width content, side panels, grid sections, and dark-mode tokens.
- Kept backend compatibility by reading the current Express endpoints and using graceful fallback content only when the old API is unavailable.

## Follow-up migration work

## Data migration completed in this pass

- Removed the hardcoded demo stories from `frontend/src/lib/comic-data.ts`. The old fixed entries included `Solo Leveling`, `Versatile Mage`, `Martial Peak`, generated chapter titles, and generated reader paragraphs.
- `comic-data.ts` is now a real database adapter. It calls `story.service.ts`, which queries Sequelize/PostgreSQL. If the database is empty or unavailable it returns empty collections, not fake stories.
- Added PostgreSQL Sequelize models in `frontend/src/models/index.ts`: `User`, `Story`, `Chapter`, `Author`, `Genre`, `Tag`, `Favorite`, `ReadingHistory`, `Rating`, and `CrawlSource`.
- Added Next route handlers for story list/detail/chapter content, search, genres, authors, auth, favorites, history, rating, and admin crawler endpoints.
- Added auth with bcrypt password hashes and httpOnly JWT cookies. Seed admin: `admin@example.com` / `admin123456`.
- Added crawler service in `frontend/src/services/crawler.service.ts`. It reuses the old crawler source and selectors from `backend/src/Data/TruyenCrawlerData.js`, but now upserts normalized Story/Chapter/Author/Genre/Tag rows into PostgreSQL.
- The old crawler remains in `backend`; it was inspected and left intact. The new Next crawler fixes the old `includeContent` path and persists real chapter content from `.chapter-c/#chapter-c`.
- Added Docker full-stack files: root `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`, plus `frontend/.env.example`.

## Real data flow now

- Homepage/list/search/detail/reader read from PostgreSQL through `frontend/src/services/story.service.ts`.
- `/stories/[slug]` loads a real DB story and real DB chapters.
- `/stories/[slug]/chapters/[chapterSlug]` loads real chapter content saved by crawler.
- `/favorites`, `/history`, and `/profile` read session/user/database state instead of static UI data.
- Empty database state shows an explicit empty state with the crawl command instead of mock results.

## Remaining hardening work

- Add richer admin edit/delete screens for story/chapter fields.
- Add UI buttons for rating/favorite on every card, beyond the API and protected pages now present.
- Expand crawler coverage and tune selector rules per genre/source as production data grows.
