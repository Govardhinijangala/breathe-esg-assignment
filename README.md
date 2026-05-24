# BreatheESG — Emission Records Ingestion Platform

A full-stack ESG (Environmental, Social, Governance) data ingestion platform built as an internship assignment for Breathe. It allows uploading CSV files from multiple emission sources, storing records in a database, validating data, and approving records through a clean UI.

---

## Project Overview

Companies generate ESG emission data from multiple sources — ERP systems like SAP, utility providers, and travel logs. This platform ingests that data via CSV upload, normalizes it, flags invalid entries, and provides a review workflow for approving records.

---

## Features

- Upload CSV files from SAP, Utility, or Travel sources
- Automatic validation — negative values flagged as FAILED
- Records stored with status: PENDING, APPROVED, FAILED, WARNING
- One-click Approve button per record
- Live stats dashboard (Total, Approved, Pending, Failed)
- Drag and drop CSV upload
- Animated dark-theme UI
- REST API backend

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5.2, Django REST Framework |
| Frontend | React 18, Vite, Tailwind CSS |
| Animation | Framer Motion, Lucide React |
| HTTP Client | Axios |
| Database | SQLite (development) |
| Backend Deploy | Render |
| Frontend Deploy | Vercel |

---

## Folder Structure

```
breathe-esg-assignment/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── records/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── sample_data/
│   └── sap.csv
├── README.md
├── MODEL.md
├── DECISIONS.md
├── TRADEOFFS.md
└── SOURCES.md
```

---

## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://127.0.0.1:8000`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records/` | Fetch all emission records |
| POST | `/api/upload/` | Upload CSV file |
| PATCH | `/api/records/<id>/approve/` | Approve a record |

### CSV Format Expected

```csv
company_name,value,unit,description
Acme Corp,120.5,kgCO2,Monthly electricity
```

---

## Deployment

- **Backend (Render):** https://breathe-esg-assignment-zt17.onrender.com
- **Frontend (Vercel):** https://breathe-esg-assignment.vercel.app

---

## Screenshots

> _Add screenshots here after deployment_

| Feature | Screenshot |
|---------|-----------|
| Dashboard | _coming soon_ |
| CSV Upload | _coming soon_ |
| Records Table | _coming soon_ |

---

## Future Improvements

- User authentication and role-based access
- PostgreSQL for persistent production database
- Async CSV processing with Celery for large files
- Real SAP API integration
- PDF and OCR ingestion support
- Emission factor calculations per source type
- Export approved records as PDF report
- Email notifications on record approval
