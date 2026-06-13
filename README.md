# Alumni Portal

Full-stack alumni portal with a Spring Boot backend and a Vite + React frontend.

## Tech Stack

- Backend: Spring Boot 3.2, Spring Security, MongoDB, JWT
- Frontend: React 19, Vite, Axios, React Router

## Project Structure

- `backend/` - Spring Boot API
- `frontend/` - React client

## Prerequisites

- Java 17+
- Node.js 18+
- Maven
- MongoDB running locally or a MongoDB connection string

## Environment Setup

Copy the example env files and fill in your local values:

- `backend/.env.example` -> use values for MongoDB, server port, JWT secret, and upload directory
- `frontend/.env.example` -> use the frontend API base URL

Required backend value:

- `JWT_SECRET` - set this to a long, random secret before starting the backend

## Deployment

### Backend on Render

The repository includes a root `render.yaml` configured to deploy the Spring Boot backend from `backend/`.

Set these Render environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `MONGODB_DATABASE` if you want a database name other than `alumniportal`

Render provides `PORT` automatically, and the backend now listens on that value.

### Frontend on Netlify

Set `VITE_API_BASE_URL` to your Render backend URL, for example:

- `https://your-backend-name.onrender.com/api`

The deployed frontend currently runs at `https://ouralumini.netlify.app`, which is allowed by backend CORS.

## Run Locally

### Backend Run

```bash
cd backend
mvn spring-boot:run
```

The API runs on `http://localhost:8080` by default.

### Frontend Run

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite dev server, usually `http://localhost:5173`.

## Build

### Backend Build

```bash
cd backend
mvn clean package
```

### Frontend Build

```bash
cd frontend
npm run build
```

## Notes

- The frontend uses `VITE_API_BASE_URL` from the environment when set, and falls back to `http://localhost:8080/api`.
- The backend reads MongoDB, port, upload directory, and JWT settings from environment variables with defaults where appropriate.
- `JWT_SECRET` is required and should not be committed.
