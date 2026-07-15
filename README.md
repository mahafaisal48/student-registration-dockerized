# Student Registration System (Dockerized Full-Stack App)

A full-stack student registration application: a vanilla HTML/CSS/JS frontend served by Nginx (with HTTPS), a Node.js/Express REST API backend, and a MySQL database — all orchestrated together with Docker Compose.

## Architecture
```
┌────────────┐      HTTPS      ┌────────────┐      SQL      ┌────────────┐
│  Frontend   │ ─────────────▶ │  Backend    │ ─────────────▶ │   MySQL     │
│  (Nginx)    │  REST API calls│ (Express.js)│                │             │
└────────────┘                └────────────┘                └────────────┘
```
- **Frontend**: static HTML/CSS/JS, served through Nginx configured for HTTPS
- **Backend**: Express.js REST API, connects to MySQL with automatic retry-on-failure logic
- **Database**: MySQL 8.0, with a health check gating backend startup until the DB is ready

## Features
- Register a student (name, email, student ID, department, phone number)
- View all registered students
- Duplicate email/student ID prevention (unique constraints)
- `/health` endpoint to verify backend ↔ database connectivity
- Automatic reconnect logic if the database connection drops
- Fully containerized with Docker Compose — one command to bring up the whole stack

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript, Nginx
- **Backend**: Node.js, Express, mysql2, cors, dotenv
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, Docker Compose

## Project Structure
```
.
├── backend/
│   ├── server.js       # Express app & routes
│   ├── db.js            # MySQL connection with retry logic
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Basic server status check |
| GET | `/health` | Verifies backend ↔ database connectivity |
| POST | `/register` | Registers a new student |
| GET | `/students` | Returns all registered students |

## Setup & Run

1. Clone the repo and navigate into it.
2. Create a `.env` file inside `backend/` based on `.env.example`:
   ```
   DB_HOST=mysql
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=student_registration
   PORT=3000
   ```
3. Set the same password as an environment variable for Docker Compose (e.g. in a root `.env` file):
   ```
   DB_PASSWORD=your_password_here
   ```
4. (Optional) Generate a self-signed SSL certificate for local HTTPS testing and place it in a `ssl/` folder referenced by `docker-compose.yml`:
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem
   ```
5. Build and start all services:
   ```bash
   docker-compose up --build
   ```
6. Visit `https://localhost` for the frontend, or `http://localhost:3000` for the backend API directly.
