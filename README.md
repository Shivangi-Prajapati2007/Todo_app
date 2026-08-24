# Alfido Tech MERN Tasks 1-3

This project completes three tasks from the Alfido Tech assignment:

1. RESTful API using Node + Express + MongoDB
2. React Frontend SPA with API fetching and routing
3. JWT Authentication and Protected Routes

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Backend setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

For Linux/macOS use:
```bash
cp .env.example .env
```

Edit `.env` if needed:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/alfido_tasks
JWT_SECRET=change_this_to_a_long_random_secret
```

Backend runs at:
http://localhost:5000

Test:
http://localhost:5000/api/health

## Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:
http://localhost:5173

## Features
- Register
- Login
- JWT token authentication
- Protected dashboard
- Create, read, update and delete tasks
- React routing
- Fetch API calls
- Logout

## Suggested submission
Take screenshots of:
- Register page
- Login page
- Dashboard
- MongoDB collection
- REST API response
- GitHub repository
