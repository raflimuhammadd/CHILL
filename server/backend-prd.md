Baik, saya akan buatkan PRD (Product Requirements Document) secara detail untuk implementasi backend NestJS sesuai diskusi kita.
→Read diagram/db-chill.jpg 
+ Thought: Drafting detailed PRD in Indonesian · 2ms
PRD Backend Chill Streams
1. Ringkasan Produk
Chill Streams adalah aplikasi streaming film/series berbasis React. Backend akan dibangun sebagai bagian dari aplikasi monolith dengan struktur repo terpisah antara frontend dan backend.
Target backend:
- Autentikasi user
- Manajemen katalog film/series
- Episode series
- Genre
- Favorit user
- Watch history
- Subscription plans
- Orders
- Payments via payment gateway
- Retry payment manual
- Content recommendations
2. Tech Stack Final
Frontend
- React
- Vite
- Zustand
- Redux Toolkit
- Axios
- Tailwind CSS
Backend
- NestJS
- TypeScript
- MySQL
- Raw SQL query
- mysql2/promise
- JWT authentication
- Bcrypt password hashing
- Payment gateway: Midtrans recommended
Database
- MySQL
- Tanpa ORM
- Raw query via service wrapper
3. Project Structure Monolith
Struktur recommended:
chill-streams/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── server/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── common/
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   └── mysql.service.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   └── utils/
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   └── payment.config.ts
│   │   └── modules/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── contents/
│   │       ├── episodes/
│   │       ├── genres/
│   │       ├── favorites/
│   │       ├── watch-history/
│   │       ├── subscription-plans/
│   │       ├── orders/
│   │       ├── payments/
│   │       └── recommendations/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env
│
├── shared/
│   └── types/
│
├── docker-compose.yml
└── README.md
Alasan:
- Frontend/backend tetap satu repo.
- Dependency React dan NestJS tidak bercampur.
- Bisa deploy bareng atau pisah nanti.
- Lebih real-world dibanding semua dicampur di src.
4. Database Design Final
4.1 users
Untuk akun user.
Fields:
id BIGINT PK
email VARCHAR(255) UNIQUE
username VARCHAR(100) UNIQUE
password_hash VARCHAR(255)
full_name VARCHAR(255)
avatar_url TEXT
is_premium TINYINT(1)
created_at DATETIME
updated_at DATETIME
deleted_at DATETIME
Rules:
- email wajib unique.
- username wajib unique.
- Password jangan simpan plain text.
- Gunakan password_hash.
- deleted_at untuk soft delete.
4.2 subscription_plans
Untuk daftar paket premium.
Fields:
id SMALLINT PK
name VARCHAR(100)
slug VARCHAR(100)
description TEXT
price DECIMAL(12,2)
duration_days SMALLINT
quality VARCHAR(20)
is_active TINYINT(1)
created_at DATETIME
Seed awal:
individual
duo
family
Contoh:
Individual - 49.990 - 30 days - 720p
Berdua - 79.990 - 30 days - 1080p
Keluarga - 159.990 - 30 days - 4K
4.3 contents
Untuk film dan series.
Fields:
id BIGINT PK
content_type VARCHAR(20)
title VARCHAR(255)
slug VARCHAR(255) UNIQUE
description TEXT
release_year SMALLINT
age_rating VARCHAR(5)
total_episodes SMALLINT
duration_minutes SMALLINT
youtube_id VARCHAR(100)
poster_url TEXT
banner_url TEXT
video_url TEXT
cast TEXT
creator VARCHAR(255)
rating DECIMAL(3,1)
is_premium_only TINYINT(1)
created_at DATETIME
updated_at DATETIME
deleted_at DATETIME
Recommended improvement:
content_type ENUM('movie','series')
Kalau tetap VARCHAR(20), validasi di backend.
Rules:
- movie: duration_minutes wajib ada, total_episodes bisa null.
- series: total_episodes wajib ada, episode disimpan di episodes.
- cast pakai TEXT untuk sementara. Upgrade path: table content_casts.
4.4 episodes
Untuk episode series.
Fields:
id BIGINT PK
content_id BIGINT FK -> contents.id
episode_number SMALLINT
title VARCHAR(255)
description TEXT
duration_minutes SMALLINT
youtube_id VARCHAR(100)
video_url TEXT
thumbnail_url TEXT
release_date DATE
created_at DATETIME
Constraint:
UNIQUE KEY uk_episodes_content_episode (content_id, episode_number)
Rules:
- Satu series tidak boleh punya episode number duplicate.
- content_id harus menunjuk content type series. Validasi di backend.
4.5 genres
Master genre.
Fields:
id SMALLINT PK
name VARCHAR(100) UNIQUE
slug VARCHAR(100) UNIQUE
created_at DATETIME
Contoh seed:
Action
Drama
Comedy
Thriller
Horror
Sci-Fi
Sports
Adventure
4.6 content_genres
Junction table content dan genre.
Fields:
content_id BIGINT PK, FK -> contents.id
genre_id SMALLINT PK, FK -> genres.id
Composite PK:
PRIMARY KEY (content_id, genre_id)
Meaning:
- 1 content bisa punya banyak genre.
- 1 genre bisa dimiliki banyak content.
4.7 favorites
User favorite list.
Fields:
user_id BIGINT PK, FK -> users.id
content_id BIGINT PK, FK -> contents.id
notes TEXT
added_at DATETIME
Composite PK:
PRIMARY KEY (user_id, content_id)
Reason:
- 1 user tidak bisa favorite content sama dua kali.
- Tidak perlu id terpisah.
4.8 watch_history
Progress nonton user.
Fields:
id BIGINT PK
user_id BIGINT FK -> users.id
content_id BIGINT FK -> contents.id
episode_id BIGINT FK -> episodes.id nullable
progress_seconds INT
duration_seconds INT
completed TINYINT(1)
last_watched_at DATETIME
created_at DATETIME
updated_at DATETIME
Constraint:
UNIQUE KEY uk_watch_history_user_content_episode (user_id, content_id, episode_id)
Important MySQL caveat:
- MySQL unique constraint membolehkan multiple NULL.
- Untuk movie, episode_id = NULL, constraint ini bisa gagal mencegah duplicate movie history.
- Better option: pakai generated column atau handle upsert di backend.
- Simpler practice: backend selalu cek existing by (user_id, content_id, episode_id IS NULL) sebelum insert.
Flow:
- User mulai nonton: create/update row.
- Progress berubah: update progress_seconds.
- Selesai: completed = 1.
4.9 content_recommendations
Self many-to-many untuk rekomendasi content.
Fields:
content_id BIGINT PK, FK -> contents.id
recommended_content_id BIGINT PK, FK -> contents.id
order_position SMALLINT
created_at DATETIME
Composite PK:
PRIMARY KEY (content_id, recommended_content_id)
Meaning:
- content_id: content utama.
- recommended_content_id: content yang direkomendasikan.
- order_position: urutan tampil.
Example:
Guardians of the Galaxy -> Avatar
Guardians of the Galaxy -> The Batman
Guardians of the Galaxy -> Ant-Man
Query:
SELECT c.*
FROM content_recommendations cr
JOIN contents c ON c.id = cr.recommended_content_id
WHERE cr.content_id = ?
ORDER BY cr.order_position ASC;
4.10 orders
Untuk order subscription.
Fields:
id BIGINT PK
user_id BIGINT FK -> users.id
plan_id SMALLINT FK -> subscription_plans.id
order_code VARCHAR(50) UNIQUE
amount DECIMAL(12,2)
status ENUM('pending','paid','active','expired','cancelled','failed')
expired_at DATETIME
created_at DATETIME
updated_at DATETIME
Decision:
- Pakai order_code UUID / unique public identifier.
- Jangan expose id auto increment ke client.
Recommended naming:
- order_code boleh tetap.
- Alternative lebih semantic: order_id.
- Kalau payment gateway butuh order_id, backend bisa pakai order_code.
Status meaning:
pending   = order dibuat, belum dibayar
paid      = payment sukses, belum/akan aktivasi
active    = subscription aktif
expired   = order/subscription expired
cancelled = dibatalkan user/admin
failed    = payment gagal final
Flow:
Create order -> pending
Payment succeeded -> paid -> active
24 jam payment tidak dibayar -> expired
Payment failed -> failed
User cancel -> cancelled
4.11 payments
Untuk transaksi payment gateway.
Fields:
id BIGINT PK
order_id BIGINT FK -> orders.id
payment_method VARCHAR(50)
transaction_id VARCHAR(255)
amount DECIMAL(12,2)
status ENUM('pending','succeeded','failed','cancelled','expired')
transaction_status VARCHAR(50)
payment_provider VARCHAR(50)
external_payment_id VARCHAR(255) UNIQUE
payment_url TEXT
created_at DATETIME
paid_at DATETIME
updated_at DATETIME
expired_at DATETIME
retry_count SMALLINT DEFAULT 0
last_retry_at DATETIME
Status meaning:
pending   = menunggu user bayar
succeeded = payment berhasil
failed    = payment gagal
cancelled = user cancel
expired   = payment link expired
transaction_status menyimpan raw status dari gateway:
Midtrans: capture, settlement, cancel, expire, deny, pending
Xendit: PENDING, PAID, CANCELLED, FAILED, EXPIRED
Rules:
- external_payment_id unique.
- expired_at disimpan sebagai DATETIME, bukan expression created_at + 24 jam di tipe column.
- Backend set expired_at = now + 24 hours.
5. Payment Gateway Decision
Recommended gateway:
Midtrans
Reason:
- Cocok Indonesia.
- Sandbox mudah.
- Banyak payment method lokal.
- Banyak tutorial.
- Cocok untuk belajar.
Gateway setup tidak sama antar provider.
Perbedaan umum:
Midtrans: Snap token / redirect_url / notification webhook
Xendit: invoice_url / callback token
Stripe: PaymentIntent / webhook signature
Abstract backend supaya provider bisa diganti nanti:
PaymentsService
PaymentGatewayService
MidtransService
6. Payment Retry Policy
Decision final:
Option B: Retry manual, same order, new payment attempt/updated payment tracking.
User choices:
1. Retry manual: user klik Retry Payment.
2. Track retry count: yes.
3. Expired in 24 hours.
4. No auto-renewal.
Recommended real-world implementation:
- orders tetap satu.
- Saat retry, create payment attempt baru dengan order_id sama.
- Increment retry count.
- Update last_retry_at.
- Generate payment URL baru dari Midtrans.
- Previous payment tetap jadi audit trail.
Important note:
- Kalau payments.retry_count ada di tiap row, row baru bisa menyimpan attempt number.
- Example:
- attempt 0: first payment
- attempt 1: retry pertama
- attempt 2: retry kedua
Flow:
User create order
-> orders.status = pending
-> payments.status = pending
-> payments.retry_count = 0
-> payment_url generated
If failed:
Midtrans webhook failed/deny
-> payments.status = failed
-> orders.status can stay pending or become failed
Recommended:
- Keep orders.status = pending if user still can retry.
- Mark orders.status = failed only if max retry exceeded or user abandons.
Manual retry:
User click Retry Payment
-> create new payment row
-> same order_id
-> retry_count = previous retry_count + 1
-> status = pending
-> expired_at = now + 24 hours
-> generate new payment_url
Success:
Midtrans webhook settlement/capture
-> latest payment.status = succeeded
-> payments.paid_at = now
-> orders.status = active
-> users.is_premium = 1
Expired:
Payment link expired
-> payments.status = expired
-> orders.status remains pending if retry allowed
7. Backend Modules
7.1 Auth Module
Responsibilities:
- Register
- Login
- Hash password
- Verify password
- Issue JWT
- Get current user
Endpoints:
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout optional
Register payload:
{
  "email": "user@mail.com",
  "username": "user123",
  "password": "password",
  "full_name": "User Name"
}
Login payload:
{
  "username": "user123",
  "password": "password"
}
Response:
{
  "accessToken": "jwt",
  "user": {
    "id": 1,
    "email": "user@mail.com",
    "username": "user123",
    "is_premium": false
  }
}
Security:
- Use bcrypt.
- Never return password_hash.
- JWT in Authorization header.
7.2 Users Module
Responsibilities:
- Get profile
- Update profile
- Soft delete user
- Update premium status internally after payment
Endpoints:
GET /users/me
PATCH /users/me
GET /users/:id admin/future
7.3 Contents Module
Responsibilities:
- List contents
- Detail content
- Filter by type, genre, premium, search
- Include genres
- Include episodes if series
- Include recommendations optional
Endpoints:
GET /contents
GET /contents/:id
GET /contents/slug/:slug
GET /contents/:id/episodes
GET /contents/:id/recommendations
Query examples:
GET /contents?type=movie
GET /contents?type=series
GET /contents?genre=action
GET /contents?search=ted
GET /contents?premium=false
7.4 Episodes Module
Responsibilities:
- CRUD episodes admin/future
- Get episode by id
- Get episodes by content id
Endpoints:
GET /episodes/:id
GET /contents/:contentId/episodes
POST /contents/:contentId/episodes admin/future
PATCH /episodes/:id admin/future
DELETE /episodes/:id admin/future
7.5 Genres Module
Responsibilities:
- List genres
- Admin CRUD future
Endpoints:
GET /genres
POST /genres admin/future
PATCH /genres/:id admin/future
DELETE /genres/:id admin/future
7.6 Favorites Module
Responsibilities:
- Add favorite
- Remove favorite
- Get user favorites
- Optional notes
Endpoints:
GET /favorites
POST /favorites
DELETE /favorites/:contentId
PATCH /favorites/:contentId
POST payload:
{
  "content_id": 10,
  "notes": "watch later"
}
DB behavior:
INSERT INTO favorites (user_id, content_id, notes, added_at)
VALUES (?, ?, ?, NOW())
ON DUPLICATE KEY UPDATE notes = VALUES(notes);
7.7 Watch History Module
Responsibilities:
- Save progress
- Continue watching
- Completed history
- Delete history item
Endpoints:
GET /watch-history
GET /watch-history/continue-watching
POST /watch-history
PATCH /watch-history/:id
DELETE /watch-history/:id
POST payload:
{
  "content_id": 1,
  "episode_id": 2,
  "progress_seconds": 1200,
  "duration_seconds": 2400,
  "completed": false
}
Behavior:
- Upsert by user/content/episode.
- For movie, episode_id null.
- Backend must handle null duplicate manually.
7.8 Subscription Plans Module
Responsibilities:
- Get active plans
Endpoints:
GET /subscription-plans
GET /subscription-plans/:slug
7.9 Orders Module
Responsibilities:
- Create subscription order
- Get user orders
- Get order detail
- Mark order status internally
Endpoints:
POST /orders
GET /orders
GET /orders/:orderCode
PATCH /orders/:orderCode/cancel
Create order payload:
{
  "plan_id": 1
}
Behavior:
1. Validate plan active.
2. Create orders row:
- order_code = UUID
- status = pending
- amount = plan.price
- expired_at = now + 24 hours
3. Return order.
4. Payment created separately or immediately after.
Recommended UX:
- POST /orders creates order.
- POST /payments creates payment link for order.
- Or single endpoint POST /checkout can create both. Simpler frontend.
7.10 Payments Module
Responsibilities:
- Create payment
- Retry payment
- Handle webhook
- Verify gateway signature
- Update order/user premium
Endpoints:
POST /payments
POST /payments/:orderCode/retry
POST /payments/webhook/midtrans
GET /payments/:id
Create payment payload:
{
  "order_code": "uuid-order-code",
  "payment_method": "midtrans_snap"
}
Response:
{
  "payment_url": "https://app.sandbox.midtrans.com/...",
  "external_payment_id": "midtrans-id",
  "expired_at": "2026-08-05T10:00:00.000Z"
}
Retry endpoint behavior:
POST /payments/:orderCode/retry
Rules:
- User must own order.
- Order must not be active.
- Latest payment must be failed/expired/cancelled/pending expired.
- Create new payment row.
- retry_count = latest.retry_count + 1.
- last_retry_at = now.
- Generate new Midtrans payment URL.
- Expire in 24 hours.
Webhook behavior:
Midtrans sends notification
-> verify notification
-> get transaction status
-> find payment by external_payment_id/order_code
-> update payment status
-> update order status
-> activate user premium if succeeded
Mapping:
capture/settlement -> payments.succeeded, orders.active, users.is_premium = 1
pending -> payments.pending
deny/cancel -> payments.failed/cancelled
expire -> payments.expired
7.11 Recommendations Module
Responsibilities:
- Get recommendations by content
- Optional admin manage recommendations
Endpoints:
GET /recommendations/:contentId
POST /recommendations admin/future
DELETE /recommendations admin/future
Query:
SELECT c.*
FROM content_recommendations cr
JOIN contents c ON c.id = cr.recommended_content_id
WHERE cr.content_id = ?
ORDER BY cr.order_position ASC;
8. MySQL Raw Query Architecture
Use one central DB service.
Concept:
@Injectable()
export class MysqlService {
  private pool: Pool;

  async query<T>(sql: string, params: unknown[] = []): Promise<T> {
    const [rows] = await this.pool.execute(sql, params);
    return rows as T;
  }

  async transaction<T>(
    callback: (connection: PoolConnection) => Promise<T>,
  ): Promise<T> {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
Rules:
- Always use parameterized queries.
- Never string-concat user input into SQL.
- Use transactions for:
- create order + payment
- webhook update payment + order + user
- retry payment creation
9. Security Requirements
Authentication
- JWT access token.
- Protected routes use JwtAuthGuard.
- Password hashed with bcrypt.
Authorization
- User can only access own:
- favorites
- watch history
- orders
- payments
Payment Webhook
- Verify Midtrans notification using SDK/server key.
- Do not trust raw webhook body without verification.
- Idempotency required:
- If payment already succeeded, ignore duplicate webhook.
SQL
- Parameterized queries only.
- Validate all DTOs.
- No raw user input in ORDER BY unless whitelisted.
Secrets
- Store in .env.
- Never commit:
- DB password
- JWT secret
- Midtrans server key
10. Environment Variables
Backend .env:
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=chill_streams

JWT_SECRET=change_me
JWT_EXPIRES_IN=1d

MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx

CLIENT_URL=http://localhost:5173
Frontend .env:
VITE_API_BASE_URL=http://localhost:3000
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
11. API Response Standard
Recommended response:
Success:
{
  "success": true,
  "message": "OK",
  "data": {}
}
Error:
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
Paginated:
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
12. Implementation Phases
Phase 1: Backend Foundation
- Setup NestJS in /server.
- Setup MySQL connection pool.
- Setup config module.
- Setup validation pipe.
- Setup global exception filter.
- Setup response format.
Phase 2: Database
- Create SQL DDL.
- Create seed data:
- subscription plans
- genres
- contents
- episodes
- content_genres
- content_recommendations
Phase 3: Auth + Users
- Register.
- Login.
- JWT.
- Current user.
- Update profile.
Phase 4: Content Catalog
- Contents list.
- Content detail.
- Episodes.
- Genres.
- Recommendations.
Phase 5: User Features
- Favorites.
- Watch history.
- Continue watching.
Phase 6: Orders + Payments
- Create order.
- Create Midtrans payment.
- Retry payment.
- Webhook.
- Activate premium.
Phase 7: Frontend Integration
- Replace MockAPI:
- /users -> /auth, /users
- /watch-history -> backend
- localStorage favorites -> backend
- static filmData -> /contents
- Keep localStorage only for token/user session.
Phase 8: Hardening
- Input validation.
- Error handling.
- Authorization checks.
- Webhook idempotency.
- Basic logging.
- Manual test payment sandbox.
13. SQL Constraint Checklist
Must have:
users.email UNIQUE
users.username UNIQUE
contents.slug UNIQUE
genres.name UNIQUE
genres.slug UNIQUE
episodes(content_id, episode_number) UNIQUE
favorites(user_id, content_id) PRIMARY KEY
content_genres(content_id, genre_id) PRIMARY KEY
content_recommendations(content_id, recommended_content_id) PRIMARY KEY
orders.order_code UNIQUE
payments.external_payment_id UNIQUE
Potential caveat:
watch_history(user_id, content_id, episode_id) UNIQUE
Because episode_id can be NULL, backend should still manually handle movie duplicate.
14. Important Design Decisions
Final decisions from session:
Backend: NestJS
Database: MySQL
Query style: raw query, no ORM
Payment gateway: Midtrans recommended
Monolith style: same repo, separated /client and /server
Payment retry: Option B
Retry trigger: user manually clicks Retry Payment
Retry tracking: retry_count + last_retry_at
Payment expiry: 24 hours
Subscription renewal: no auto-renewal
Orders public identifier: UUID order_code UNIQUE
Payments external ID: UNIQUE
Favorites: composite PK
Recommendations: self many-to-many composite PK
Episodes: unique content episode number
15. Open Questions for Next Session
Before coding, decide:
1. Use order_code or rename to order_id?
- Current DB uses order_code.
- For gateway, order_code is fine.
2. Max retry count?
- Suggested: 3 retries.
- If unlimited for practice, okay.
3. Admin panel needed?
- If no, skip CRUD create/update/delete contents for now.
- Seed content via SQL.
4. Refresh token needed?
- For practice, access token only is enough.
- Add refresh token later if required.
5. Store cast as TEXT or normalize?
- Current: TEXT.
- Good enough for now.
- Upgrade later to content_casts.
16. Recommended Minimum Backend Scope
Build first:
auth
users
contents
genres
episodes
favorites
watch-history
recommendations
subscription-plans
orders
payments
Skip for first version:
admin dashboard
role-based access
auto-renewal
refunds
coupons
multi-device profile
download feature
ratings by user
reviews/comments
notifications
Add only when product needs them.