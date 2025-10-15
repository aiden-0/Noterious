Noterious – Quickstart
======================

Run the app locally in two terminals: one for the backend (FastAPI) and one for the frontend (Vite + React).

## 1) Backend (FastAPI)

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- Requires PostgreSQL running and reachable via env vars in `.env` (OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX_URL, and optional DB_*). The backend auto-creates the `notes` table.
- CORS is allowed for `http://localhost:5173` by default.

## 2) Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser. The frontend talks to the API at http://127.0.0.1:8000.
