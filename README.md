# User Management System (MERN)

A full-stack MERN application with role-based access control (RBAC), JWT authentication, and a clean React UI.

## Tech Stack
- **Frontend:** React + Vite, React Router, Axios, Context API
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT (access + refresh tokens), bcrypt

## Roles
| Role | Capabilities |
|------|-------------|
| Admin | Full CRUD, assign roles, deactivate users |
| Manager | View/update non-admin users |
| User | View/update own profile only |

## Quick Start

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run seed   # Seeds 3 demo users
npm run dev    # Starts on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev    # Starts on port 5173
```

## Demo Credentials
| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123 | Admin |
| manager@example.com | Manager@123 | Manager |
| user@example.com | User@1234 | User |

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user

### Users (protected)
- `GET /api/users` — List users (Admin/Manager)
- `POST /api/users` — Create user (Admin)
- `GET /api/users/:id` — Get user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Deactivate user (Admin)

## Deployment
- Backend: Deploy to Render/Railway (set env vars in dashboard)
- Frontend: Deploy to Vercel/Netlify (set `VITE_API_URL` to deployed backend URL)
