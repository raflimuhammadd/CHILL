# Chill Streams

A full-stack video streaming platform with React frontend and Node.js backend. Stream films and series, manage playlists, track watch history, and subscribe to premium content.

## Features

### Authentication & Authorization
- User registration with email verification
- JWT-based authentication with refresh tokens
- Protected routes and API endpoints
- Rate limiting (general, auth, strict tiers)
- Secure password hashing with bcrypt

### Content Discovery
- Browse films and series with episodes
- Search with filters (genre, content type, year, rating)
- Trending, Top Rated, New Releases sections
- Continue watching (personalized to user)
- Content recommendations based on viewing history
- Genre categorization

### Video Player
- Custom video player with full controls
- Play/pause, seek, volume control
- Subtitle support with menu
- Playback speed control (0.5x to 2x)
- Episode navigation for series
- Auto-play next episode overlay
- Watch progress tracking per episode
- Premium content gating for free tier users

### User Management
- Profile page with avatar upload
- Profile information editing
- Watch history with progress tracking
- Continue watching list
- Notifications page

### My List (Favorites)
- Add/remove content to favorites
- Local storage persistence (no backend sync)
- Quick access to favorite films and series
- Clear all favorites with confirmation

### Subscription & Payment
- Three subscription tiers: Free, Standard, Premium
- Midtrans payment gateway integration
- Multiple payment methods:
  - GoPay
  - QRIS
  - Bank Transfer (VA)
  - Credit Card
- Order tracking and payment verification
- Payment status notifications
- Subscription plan comparison

### API Documentation
- Swagger UI for API exploration
- OpenAPI specification available
- Health check endpoint

## Tech Stack

### Frontend
- React 19.2.7 - Modern UI framework
- Vite 8.1.1 - Lightning-fast build tool
- React Router 7.18.1 - Client-side routing
- Zustand 5.0.14 - Lightweight state management (auth, favorites, player, modals)
- Redux Toolkit 2.12.0 - State management (users, watch history)
- Tailwind CSS 4.3.2 - Utility-first styling
- Axios 1.18.1 - HTTP client with interceptors
- React Hot Toast 2.6.0 - Toast notifications
- QRCode.react 4.2.0 - QR code generation

### Backend
- Node.js with Express 5.2.1 - Web framework
- MySQL 8.4 - Relational database
- JWT (jsonwebtoken 9.0.3) - Authentication
- Bcryptjs 3.0.3 - Password hashing
- Midtrans Client 1.4.3 - Payment gateway
- Nodemailer 9.0.5 - Email service
- Multer 2.2.0 - File upload handling
- Express Rate Limit 8.6.2 - API rate limiting
- Cookie Parser 1.4.7 - Cookie handling
- CORS 2.8.6 - Cross-origin resource sharing

### Database
- MySQL 8.4 - Via Docker container
- Tables: users, contents, episodes, content_genres, genres, favorites, watch_history, orders, payments, subscription_plans, content_recommendations, refresh_tokens

### Testing & Development
- Cypress 15.21.1 - End-to-end testing
- Playwright 1.62.1 - Browser testing
- ESLint 10.x - Code linting
- Nodemon 3.1.14 - Development auto-reload

## Prerequisites

- Node.js 18+ and npm (or yarn)
- Docker and Docker Compose
- MySQL Client (DBeaver, MySQL Workbench, or CLI)
- Git

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd chill-streams-fullstack/code
```

### 2. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd ../server
npm install
```

### 3. Environment Configuration

**Backend `.env` file** (`server/.env`):
```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=chill_streams

# JWT
JWT_SECRET=your_secure_jwt_secret_here_change_in_production
JWT_REFRESH_SECRET=your_secure_refresh_secret_here_change_in_production
JWT_EXPIRE=7d

# Payment Gateway (Midtrans)
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=2097152
```

**Frontend `.env` file** (`client/.env`):
```bash
VITE_API_URL=http://localhost:3000/api
```

## Database Setup

### 1. Start MySQL Container
```bash
# From project root directory
docker-compose up -d
```

Verify container is running:
```bash
docker ps
```

MySQL will be available at `localhost:3307` (mapped from internal port 3306).

### 2. Run Database Migrations

Option A: Using DBeaver or MySQL Workbench
1. Connect to `localhost:3307` with credentials: root / (empty password)
2. Create new connection or use existing
3. Execute SQL files from `server/database/migrations/` in order

Option B: Using MySQL CLI
```bash
mysql -h 127.0.0.1 -P 3307 -u root < server/database/chill-streams-schema.sql
```

The schema will create all necessary tables automatically.

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:3000`
Swagger API docs available at `http://localhost:3000/api-docs`

### Terminal 2: Start Frontend Dev Server
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

### Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- API Documentation: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/api/health

## Project Structure

```
code/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/             # Shared components (Navbar, Footer, Hero)
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── MovieCard.jsx
│   │   │   │   ├── ContentSection.jsx
│   │   │   │   ├── FilmDetailModal.jsx
│   │   │   │   ├── SeriesDetailModal.jsx
│   │   │   │   ├── HoverOverlay.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/                 # UI components (Button, Badge, Icon)
│   │   │       ├── Button.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Icon.jsx
│   │   │       ├── Input.jsx
│   │   │       └── FormField.jsx
│   │   ├── features/               # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── LoginPage.jsx
│   │   │   │   │   ├── RegisterPage.jsx
│   │   │   │   │   └── VerifyEmailPage.jsx
│   │   │   │   ├── components/
│   │   │   │   └── store/
│   │   │   ├── video/
│   │   │   │   ├── pages/
│   │   │   │   │   └── WatchPage.jsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── VideoPlayer.jsx
│   │   │   │   │   ├── PlayerControls.jsx
│   │   │   │   │   └── EpisodeListMenu.jsx
│   │   │   │   └── store/
│   │   │   ├── my-list/
│   │   │   │   ├── pages/
│   │   │   │   │   └── MyListPage.jsx
│   │   │   │   └── components/
│   │   │   ├── profile/
│   │   │   │   ├── pages/
│   │   │   │   │   └── ProfilePage.jsx
│   │   │   │   └── components/
│   │   │   │       ├── ProfileForm.jsx
│   │   │   │       └── AvatarUpload.jsx
│   │   │   └── subscription/
│   │   │       ├── pages/
│   │   │       │   ├── PremiumPage.jsx
│   │   │       │   └── PaymentPage.jsx
│   │   │       └── components/
│   │   │           ├── SubscriptionPlanCard.jsx
│   │   │           └── PaymentMethodOption.jsx
│   │   ├── hooks/                  # Custom hooks
│   │   │   ├── useFilmData.js
│   │   │   ├── useFavorites.js
│   │   │   ├── usePremiumAccess.js
│   │   │   ├── useDetailModal.js
│   │   │   └── useSearchContent.js
│   │   ├── pages/                  # Main page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── DetailPage.jsx
│   │   │   ├── SeriesPage.jsx
│   │   │   ├── FilmPage.jsx
│   │   │   ├── ContinueWatchingPage.jsx
│   │   │   ├── TopRatingPage.jsx
│   │   │   ├── TrendingPage.jsx
│   │   │   ├── NewReleasePage.jsx
│   │   │   ├── WatchHistoryPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── CommunityPage.jsx
│   │   ├── services/               # API services
│   │   │   ├── apiClient.js       # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── contentService.js
│   │   │   ├── watchHistoryService.js
│   │   │   ├── paymentService.js
│   │   │   └── uploadService.js
│   │   ├── store/                  # Redux store
│   │   │   ├── slices/
│   │   │   │   ├── usersSlice.js
│   │   │   │   └── watchHistorySlice.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── cypress/                    # E2E tests
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js backend
│   ├── config/
│   │   └── database.js             # MySQL connection pool
│   ├── features/                   # Feature modules (routes → controller → service → db)
│   │   ├── auth/
│   │   │   ├── authRoutes.js
│   │   │   ├── authController.js
│   │   │   └── authService.js
│   │   ├── content/
│   │   │   ├── contentRoutes.js
│   │   │   ├── contentController.js
│   │   │   └── contentService.js
│   │   ├── genre/
│   │   │   ├── genreRoutes.js
│   │   │   ├── genreController.js
│   │   │   └── genreService.js
│   │   ├── payment/
│   │   │   ├── paymentRoutes.js
│   │   │   ├── paymentController.js
│   │   │   └── paymentService.js
│   │   ├── upload/
│   │   │   ├── uploadRoutes.js
│   │   │   ├── uploadController.js
│   │   │   └── uploadService.js
│   │   ├── user/
│   │   │   ├── userRoutes.js
│   │   │   ├── userController.js
│   │   │   └── userService.js
│   │   └── watch-history/
│   │       ├── watchHistoryRoutes.js
│   │       ├── watchHistoryController.js
│   │       └── watchHistoryService.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorHandler.js         # Global error handling
│   │   └── rateLimiter.js          # Rate limiting
│   ├── utils/
│   │   ├── error.js                # Custom error classes
│   │   ├── apiResponse.js          # Standardized responses
│   │   ├── validators.js           # Input validators
│   │   ├── constant.js             # Constants
│   │   └── emailService.js         # Email sending
│   ├── database/
│   │   ├── migrations/
│   │   │   └── chill-streams-schema.sql
│   │   └── README.md
│   ├── uploads/                    # User uploaded files
│   ├── index.js                    # Express app entry point
│   ├── package.json
│   └── .env
│
├── BACKEND-ARCHITECTURE.md         # Detailed backend design
├── FRONTEND-ARCHITECTURE.md        # Detailed frontend design
└── README.md                       # This file
```

## API Endpoints

All endpoints prefixed with `/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout user

### Content
- `GET /contents` - Get all contents (with pagination)
- `GET /contents/search?q=query` - Search contents
- `GET /contents/:id` - Get content by ID
- `GET /contents/:id/episodes` - Get episodes for content
- `GET /contents/:id/recommendations` - Get recommendations
- `GET /contents/slug/:slug` - Get content by slug

### Genres
- `GET /genres` - Get all genres
- `GET /genres/:id` - Get genre by ID
- `POST /genres` - Create new genre
- `PATCH /genres/:id` - Update genre
- `DELETE /genres/:id` - Delete genre

### Users
- `GET /users/me` - Get current user profile (requires auth)
- `PATCH /users/me` - Update user profile (requires auth)
- `GET /users/favorites` - Get user favorites (requires auth)
- `POST /users/favorites` - Add to favorites (requires auth)
- `DELETE /users/favorites/:contentId` - Remove from favorites (requires auth)

### Watch History
- `GET /watch-history` - Get watch history (requires auth)
- `POST /watch-history` - Add watch history entry (requires auth)
- `PATCH /watch-history/:id` - Update watch history (requires auth)
- `DELETE /watch-history/:id` - Delete watch history (requires auth)

### Payment (Midtrans)
- `POST /payments` - Create payment (requires auth)
- `GET /payments/:orderCode` - Get payment by order code (requires auth)
- `POST /payments/:orderCode/verify` - Verify payment (requires auth)
- `POST /payments/midtrans/notification` - Midtrans webhook
- `GET /payments/config/client-key` - Get Midtrans client key

### Upload
- `POST /upload/avatar` - Upload user avatar (requires auth, multipart)

### System
- `GET /health` - Health check
- `GET /api-docs` - Swagger API documentation

## Testing

### Frontend E2E Tests (Cypress)

Run tests in interactive mode:
```bash
cd client
npm run cypress:open
```

Run tests headlessly:
```bash
cd client
npm run cypress:run
```

### Frontend Tests (Playwright)
Playwright is configured as dev dependency for advanced browser testing.

### Backend API Testing
Use Postman or curl to test backend endpoints:
```bash
# Example: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Example: Get all contents
curl -X GET http://localhost:3000/api/contents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3307` |
| `DB_USER` | Database user | `root` |
| `DB_PASSWORD` | Database password | (empty for local dev) |
| `DB_NAME` | Database name | `chill_streams` |
| `JWT_SECRET` | JWT signing secret | Long random string |
| `JWT_REFRESH_SECRET` | JWT refresh secret | Long random string |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `MIDTRANS_SERVER_KEY` | Midtrans server key | From Midtrans dashboard |
| `MIDTRANS_CLIENT_KEY` | Midtrans client key | From Midtrans dashboard |
| `MIDTRANS_IS_PRODUCTION` | Midtrans environment | `true` / `false` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `your@email.com` |
| `EMAIL_PASSWORD` | Email app password | From email provider |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max file size (bytes) | `2097152` (2MB) |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use environment variables from hosting provider (AWS, Heroku, DigitalOcean, etc.)
3. Set `MIDTRANS_IS_PRODUCTION=true` for live payments
4. Configure `CORS_ORIGIN` to your frontend domain
5. Use managed MySQL service or Docker container in production

### Frontend Deployment
1. Build: `npm run build`
2. Set `VITE_API_URL` to production backend URL
3. Deploy `dist/` folder to hosting (Vercel, Netlify, AWS S3, etc.)

### Database Deployment
- Use managed MySQL service (AWS RDS, Google Cloud SQL, etc.)
- Run migrations on production database before deploying new code
- Set up regular backups

## Documentation

- [Backend Architecture](./BACKEND-ARCHITECTURE.md) - Data flow, API patterns, middleware, services
- [Frontend Architecture](./FRONTEND-ARCHITECTURE.md) - Component structure, state management, hooks

## Key Features Implementation Details

### State Management
- Zustand stores: Authentication, favorites, player state, modals
- Redux slices: Users data, watch history
- localStorage: Favorites persistence (no backend sync)

### Video Player
- Custom controls: play, pause, seek, volume, subtitle, speed
- Episode list for series
- Auto-play next episode
- Premium content gating
- Watch progress tracking

### Payment Integration
- Midtrans Snap integration
- Multiple payment methods: GoPay, QRIS, Bank Transfer, Credit Card
- Webhook notification handling
- Order status tracking

### Search & Discovery
- Full-text search with debouncing
- Filter by genre, content type, year
- Content recommendations engine
- Trending and top-rated sections

## Available Scripts

### Frontend (`client/`)
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run preview          # Preview production build
npm run cypress:open     # Open Cypress test runner
npm run cypress:run      # Run Cypress tests headlessly
```

### Backend (`server/`)
```bash
npm run start            # Start production server
npm run dev              # Start development server with auto-reload
npm run lint             # Run ESLint
npm test                 # Run tests
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feedback, please open an issue on GitHub or contact the development team.
