# CRM – Companies & Email Campaigns

A small B2B CRM: keep a list of companies, create email campaigns, add companies as recipients and mark campaigns as sent.
Backend is a Django REST API with JWT login; frontend is Next.js + TypeScript.

## Tech stack

| Part | Tech |
|---|---|
| Backend | Python, Django 6, Django REST Framework, Simple JWT, SQLite (dev) |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Axios, React Hook Form, Tailwind CSS |

## Features

- **Sign up / log in** with JWT (access + refresh tokens); every API route needs a token.
- **Companies:** list, search (debounced) and CRUD.
- **Campaigns:** create campaigns (draft / scheduled / sent), open a campaign, add companies as recipients (duplicates are rejected), mark as sent.
- **Frontend data layer:** custom hooks (`useCompanies`, `useCampaigns`, `useCampaignDetail`, `useDebounce`) on top of TanStack Query, one Axios client that adds the token to every request.
- **Demo data:** `python manage.py create_dummy_data` fills the database with sample companies.

## API

| Method | Path | What it does |
|---|---|---|
| POST | `/api/accounts/signup/` | create a user |
| POST | `/api/accounts/login/` | get access + refresh tokens |
| POST | `/api/accounts/token/refresh/` | new access token |
| GET/POST/PUT/DELETE | `/api/companies/` | companies CRUD |
| GET/POST/PUT/DELETE | `/api/campaigns/` | campaigns CRUD |
| POST | `/api/campaigns/{id}/add_recipient/` | add a company to a campaign |
| POST | `/api/campaigns/{id}/send_campaign/` | mark the campaign as sent |

## Run it locally

**Backend** (http://127.0.0.1:8000)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # then put your own DJANGO_SECRET_KEY in .env
python manage.py migrate
python manage.py create_dummy_data
python manage.py runserver
```

**Frontend** (http://localhost:3000)

```bash
cd frontend
npm install
npm run dev
```

## Configuration

All secrets and environment-specific values are read from environment variables (or `backend/.env`, which is git-ignored). See `backend/.env.example`:

| Variable | Meaning |
|---|---|
| `DJANGO_SECRET_KEY` | required; the app will not start without it |
| `DJANGO_DEBUG` | `True` only for local development |
| `DJANGO_ALLOWED_HOSTS` | comma-separated host names |
| `CORS_ALLOWED_ORIGINS` | which frontend URLs may call the API |
