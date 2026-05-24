# Data Model Design — EmissionRecord

## Schema

```python
class EmissionRecord(models.Model):
    company_name     = CharField(max_length=100)
    source_type      = CharField(choices=['SAP', 'UTILITY', 'TRAVEL'])
    raw_value        = FloatField()
    normalized_value = FloatField(null=True, blank=True)
    unit             = CharField(max_length=20)
    status           = CharField(choices=['PENDING', 'APPROVED', 'FAILED', 'WARNING'])
    description      = TextField(blank=True)
    created_at       = DateTimeField(auto_now_add=True)
```

---

## Why This Schema Was Designed

The schema is designed around the core ESG data ingestion workflow: ingest raw data, track its origin, validate it, and support a human review step before it is considered approved.

Each field serves a specific purpose in that pipeline rather than being added speculatively.

---

## Source Tracking

`source_type` stores where the data came from — SAP (ERP system), UTILITY (electricity/gas provider), or TRAVEL (employee travel logs). This is critical in ESG reporting because different sources have different emission factors, units, and reliability levels. Tracking the source allows future logic to apply source-specific calculations or flag records from less reliable sources.

---

## Validation Logic

Validation runs at ingestion time inside the upload view:

- If `raw_value < 0` → status is set to `FAILED` (negative emissions are physically invalid)
- All other records default to `PENDING` and await human review

This is intentionally simple for an MVP. In production, validation would also check unit consistency, outlier detection, and cross-source reconciliation.

---

## Audit Trail Support

`created_at` is set automatically using `auto_now_add=True`, meaning it records exactly when the record entered the system. Combined with `status`, this gives a basic audit trail — you can see when data arrived and whether it was approved or rejected.

In a production system, this would be extended with an `updated_at` field, an `approved_by` foreign key to a User, and a separate AuditLog table tracking every status change.

---

## How normalized_value Helps Future ESG Calculations

`raw_value` stores the original number exactly as it came from the source CSV. `normalized_value` is intended to store the value after unit conversion — for example, converting MWh to kgCO2 using an emission factor.

Keeping both values means the original data is never lost, and the normalized value can be recalculated if emission factors are updated. This separation is standard practice in ESG data platforms.

Currently `normalized_value` is set equal to `raw_value` as a placeholder since emission factor tables are outside the scope of this MVP.

---

## Multi-Source Ingestion Handling

Each upload request includes a `source_type` parameter alongside the file. This means the same CSV structure can be reused across sources — the source is tagged at upload time rather than embedded in the file. This keeps the CSV format simple while still allowing source-level filtering and reporting on the backend.
