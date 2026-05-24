# Tradeoffs and Limitations

This document honestly describes the limitations of the current implementation and explains why each tradeoff was acceptable for an internship assignment MVP.

---

## 1. No Authentication System

The platform has no login, no user accounts, and no role-based access control. Anyone with the URL can upload files and approve records.

**Why acceptable:** Authentication adds significant complexity — user models, JWT tokens, session management, protected routes on the frontend. For a demo MVP focused on the data ingestion workflow, it would obscure the core functionality. In production, Django's built-in auth system or a library like `djangorestframework-simplejwt` would be added.

---

## 2. No Real SAP Integration

Data is ingested via CSV upload rather than a live connection to an SAP system. There is no SAP API connector, no RFC calls, and no real-time sync.

**Why acceptable:** SAP integration requires licensed access, credentials, and knowledge of specific SAP modules (MM, FI, PM). This is not available in an internship context. CSV upload is a realistic simulation of how data would be extracted from SAP by a finance team and handed to the platform.

---

## 3. No OCR or PDF Ingestion

Utility bills and travel receipts often come as PDFs. This platform only accepts CSV files.

**Why acceptable:** PDF parsing requires OCR libraries (Tesseract, AWS Textract) and document layout understanding, which is a significant engineering effort on its own. CSV was chosen to keep the focus on the data pipeline and review workflow rather than document processing.

---

## 4. Simplified ESG Calculations

The `normalized_value` field is currently set equal to `raw_value`. No real emission factor calculations are performed — there is no conversion from MWh to kgCO2, no Scope 1/2/3 categorization, and no GHG Protocol alignment.

**Why acceptable:** Accurate ESG calculations require emission factor databases (IPCC, EPA, DEFRA) that are outside the scope of this assignment. The data model is designed to support these calculations in the future — the separation of `raw_value` and `normalized_value` exists precisely for this reason.

---

## 5. No Asynchronous Processing

CSV files are processed synchronously inside the HTTP request. If a file has 100,000 rows, the request would time out.

**Why acceptable:** The sample data is small. For production scale, CSV processing would be offloaded to a task queue like Celery with Redis, returning a job ID immediately and notifying the user when processing is complete. This architecture was intentionally deferred to keep the codebase simple.

---

## 6. SQLite Instead of PostgreSQL

SQLite is used as the database. On Render, the database is wiped on every redeploy because the filesystem is ephemeral.

**Why acceptable:** SQLite requires no setup and works identically to PostgreSQL for the query patterns used here. For a demo, data persistence across deploys is not critical. Switching to PostgreSQL requires only a settings change and adding `psycopg2` — the Django ORM abstracts the difference entirely.

---

## 7. Limited Validation Rules

The only validation implemented is: negative values are marked as FAILED. There are no checks for duplicate records, unrealistic outliers, missing required fields, or unit inconsistencies.

**Why acceptable:** Comprehensive validation requires domain knowledge about what constitutes a valid emission value for each source type and industry. Implementing fake validation rules would be worse than simple ones — it would give false confidence in data quality. The current rule demonstrates the validation pattern correctly and honestly.
