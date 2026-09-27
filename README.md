# InterviewIQ AI

InterviewIQ AI is a next-generation AI-powered interview preparation platform designed to help candidates prepare for technical, HR, behavioral, coding, aptitude, and system design interviews through personalized, AI-driven learning experiences.

## Architecture

This project is structured as a Monorepo:
- `/frontend`: React + TypeScript + Vite + Tailwind CSS + shadcn/ui.
- `/backend`: Node.js + Express + TypeScript + Prisma ORM.

## Tech Stack

- **Frontend**: React (v18+), Vite, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Framer Motion
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Cache & Key-Value Storage**: Redis
- **AI Integrations**: Gemini 2.5, Whisper, ElevenLabs, Tavily
- **Code Execution**: Judge0

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) and Docker Compose

### 1. Database & Cache Setup (Docker)
Start the PostgreSQL and Redis containers:
```bash
docker compose up -d
```

### 2. Backend Setup
Go to the backend folder, install dependencies, configure environment, and run migrations:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials/keys
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Go to the frontend folder, install dependencies, and start development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:5173/` and backend API at `http://localhost:5000/`.
