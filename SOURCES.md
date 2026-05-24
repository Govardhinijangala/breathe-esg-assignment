# Data Sources and Assumptions

This document explains the assumptions behind the sample data formats used in this project and the inspiration for the CSV structures.

---

## Overview

Since this is an internship assignment without access to real enterprise systems, all sample data was designed to simulate realistic CSV exports from common ESG data sources. The structures are based on publicly available documentation, ESG reporting frameworks, and common enterprise data export patterns.

---

## 1. SAP CSV Export Structure

**Assumption:** SAP ERP systems (commonly used for procurement and energy management) can export consumption data via transaction reports. A typical export would include the consuming entity (company or cost center), the measured value, the unit of measurement, and a description of the activity.

**Sample structure used:**
```csv
company_name,value,unit,description
Acme Manufacturing,1500.0,kgCO2,Monthly gas consumption
```

**Simplification:** Real SAP exports include many additional fields — plant codes, cost centers, material numbers, fiscal periods, and currency. These were stripped down to the minimum fields needed to demonstrate ingestion.

---

## 2. Utility Electricity Consumption CSV

**Assumption:** Utility providers (electricity, gas, water) typically provide billing data exports through their customer portals. These exports include consumption figures, billing periods, and meter identifiers.

**Sample structure used:**
```csv
company_name,value,unit,description
City Office,850.0,kWh,October electricity bill
```

**Simplification:** Real utility exports include tariff codes, meter serial numbers, billing addresses, and VAT breakdowns. The sample focuses only on the consumption value and unit relevant to ESG calculations.

**ESG inspiration:** The GHG Protocol Scope 2 guidance recommends tracking electricity consumption in kWh and converting to kgCO2 using grid emission factors. The `unit` field in the model supports this future conversion.

---

## 3. Travel Emissions CSV Format

**Assumption:** Corporate travel data is typically exported from travel management systems (Concur, Amadeus) or expense platforms. It includes trip details, distance or fuel consumption, and transport mode.

**Sample structure used:**
```csv
company_name,value,unit,description
Sales Team,320.0,km,London to Manchester return flight
```

**Simplification:** Real travel data includes passenger counts, flight numbers, cabin class (which affects per-passenger emission factors), and expense categories. Distance in km was used as a proxy for emission calculation input.

**ESG inspiration:** The GHG Protocol Scope 3 Category 6 (Business Travel) covers air, rail, and road travel. Distance-based calculation is one of the accepted methods.

---

## Limitations of Mock Datasets

- Values are illustrative and not based on real company data
- Emission factors are not applied — `normalized_value` equals `raw_value`
- No seasonal variation or multi-period data is represented
- Company names are fictional placeholders
- The sample `sap.csv` file contains a small number of rows sufficient for UI demonstration only

---

## ESG Reporting Inspiration

- [GHG Protocol Corporate Standard](https://ghgprotocol.org/corporate-standard)
- [UK Government GHG Conversion Factors (DEFRA)](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting)
- [ISO 14064-1 Greenhouse Gas Accounting](https://www.iso.org/standard/66453.html)
