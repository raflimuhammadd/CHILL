# Chill Streams

Full-stack streaming platform with React frontend and Node.js backend.

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, Redux Toolkit
- Backend: Node.js, Express, MySQL
- Database: MySQL 8.4 (Docker)

## Setup
1. Clone repo
2. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
3. Start MySQL: docker-compose up -d
4. Run migrations in DBeaver
5. Start backend: cd server && npm run dev
6. Start frontend: cd client && npm run dev