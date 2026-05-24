# Engineering Decisions

This document explains the key technical decisions made during development of the BreatheESG ingestion platform.

---

## 1. Why CSV Ingestion Was Selected

CSV was chosen as the ingestion format because it is the most common export format from enterprise systems like SAP, utility billing platforms, and travel management tools. Most finance and operations teams can produce a CSV without any technical knowledge.

More advanced formats like direct API integration with SAP or PDF parsing were considered but ruled out for this MVP — they require credentials, connectors, and infrastructure that are outside the scope of an internship assignment. CSV provides a realistic simulation of how data would enter the system in an early-stage product.

---

## 2. Why Django REST Framework Was Used

Django REST Framework (DRF) was chosen for the backend because:

- Django has built-in ORM, migrations, and admin panel — reducing boilerplate
- DRF adds serialization and API views with minimal code
- It is widely used in Python data engineering environments, which aligns with ESG platforms that often sit alongside data pipelines
- The `pandas` library integrates naturally with Django for CSV processing

FastAPI was considered but Django was preferred for its batteries-included approach, which is more appropriate when the focus is on data modeling and business logic rather than raw API performance.

---

## 3. Why React Vite Frontend Was Used

Vite was chosen over Create React App because it is significantly faster to build and has become the modern standard for React projects. Tailwind CSS was added for rapid UI development without writing custom CSS. Framer Motion was used to add animations that make the interface feel polished without requiring complex CSS keyframe work.

The frontend is intentionally kept as a single `App.jsx` file to keep the codebase simple and readable for an internship-level project.

---

## 4. Why Simplified Validation Logic Was Implemented

The only validation rule implemented is: negative values are marked as FAILED. This was a deliberate scope decision.

Real ESG validation would involve emission factor lookups, unit conversion tables, cross-source reconciliation, and regulatory threshold checks. Implementing all of that correctly would require domain expertise and data that is not available in a mock environment. The simplified rule demonstrates the validation pattern without making false claims about ESG accuracy.

---

## 5. Why SQLite Was Used

SQLite was used because it requires zero configuration and works out of the box with Django. For a local development environment and an MVP demo, it is entirely sufficient.

The tradeoff is that SQLite is not suitable for production — it does not support concurrent writes and Render's filesystem resets on redeploy, wiping the database. PostgreSQL would be the correct choice for a real deployment, and the migration path from SQLite to PostgreSQL in Django is straightforward.

---

## 6. Assumptions Made During Development

- CSV files follow a consistent column structure: `company_name`, `value`, `unit`, `description`
- Source type is provided by the user at upload time rather than detected from the file
- All monetary and emission values are numeric floats
- No authentication is required for this MVP — all users can upload and approve
- The `normalized_value` equals `raw_value` until real emission factors are available

---

## 7. Questions I Would Ask a Product Manager

Before building a production version, I would ask:

- What are the exact CSV formats exported by the SAP system in use?
- Should records from different sources use different validation rules?
- Who is allowed to approve records — any user, or only specific roles?
- What happens to FAILED records — are they deleted, archived, or resubmitted?
- Is there a regulatory standard (GHG Protocol, ISO 14064) we need to align with?
- How many records are expected per upload — hundreds or millions?
- Should approved records feed into a reporting dashboard or external system?
- What is the data retention policy for emission records?
