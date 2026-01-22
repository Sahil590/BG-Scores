# Board Game Score Recorder

This is a web application to record board game scores, built with Django (Backend) and React (Frontend).

## Features

- Add Games
- Add Players
- Record Scores for a Game and Player
- View Recent Scores

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React, Vite
- **Database**: PostgreSQL (configured for Vercel)
- **Deployment**: Ready for Vercel

## Setup Instructions

### Prerequisites

- Python 3.13+
- Node.js 22+

### Backend Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   cd backend
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://127.0.0.1:8000/api/`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Deployment

Configure your Vercel project to point to the root directory. Vercel will handle the Python backend and React frontend build if configured correctly (e.g. using `vercel.json` or standard Vercel detection).
