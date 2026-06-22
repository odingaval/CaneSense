# Canesense — Sugarcane Stress Cause Advisor

> An AI advisory tool that tells a smallholder sugarcane farmer not just **THAT** their crop is stressed, but **WHY** — water, soil, or pest — by combining what the farmer reports with satellite and soil data for their exact field, then recommending one specific, low-cost action they can take that day.

---

## Table of contents

- [What the application does](#what-the-application-does)
- [Who it is for](#who-it-is-for)
- [How AI is used](#how-ai-is-used)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Data sources](#data-sources)
- [Running the demo](#running-the-demo)
- [Contributing](#contributing)

---

## What the application does

Smallholder sugarcane farmers in Kenya's sugar belt can usually see that something is wrong with their crop — yellowing, wilting, stunted growth. What they cannot tell is **why**: water shortage, soil nutrient deficiency, or pest pressure. That "why" decides what they should do next, and guessing wrong wastes money on inputs that do not match the real problem.

Canesense solves that one specific gap. The farmer describes what they see; the system fuses that report with satellite vegetation data, recent rainfall history, and soil baseline data for their exact field; an AI reasoning engine ranks the likely causes with a confidence score and a plain-language explanation; and the farmer receives one clear recommended action — with an estimate of the cost saved compared to their default practice.

Low-confidence cases are routed to a human extension officer rather than forcing a guess.

**The application has three screens:**

| Screen | What it does |
|--------|-------------|
| My field | Shows the farmer's registered field as a map pin with a status badge: healthy, caution, or urgent |
| Report a problem | A short guided form — crop stage, symptom (free text or picklist), location in field, recent rain — then "Check my field" |
| Result | Likely cause + confidence level, plain-language reasoning, one recommended action, estimated cost saved, and an option to escalate to an extension officer |

---

## Who it is for

**Primary user:** Smallholder sugarcane farmers in Kenya, typically farming 0.5–2 hectares, using a basic or low-end smartphone, often with patchy network coverage.

**Secondary beneficiaries:** Extension officers who receive escalated low-confidence cases, and cooperatives or millers who gain better yield predictability.

**Real-conditions design decisions:**
- SMS fallback for the result — same advice compressed for low connectivity or feature phones
- Symptom picklist as an alternative to typing free text (low literacy support)
- Output generated in Swahili and English
- System never blocks on incomplete input — it returns a lower-confidence answer and flags what is missing

---

## How AI is used

The AI's role is **differential diagnosis across three independent data sources** — not a lookup table or a form with a chatbot bolted on.

1. **Classification** — reads the farmer's free-text symptom description and classifies it against known stress patterns for sugarcane (tip-yellowing, whole-leaf, patchy, holes, wilting, etc.)
2. **Evidence fusion** — combines that classification with:
   - Satellite NDVI vegetation trend for the field's exact location (last 30 days)
   - Recent rainfall and water-balance data
   - Soil baseline data (nitrogen, phosphorus, pH) for that field
3. **Reasoning and ranking** — weighs symptom pattern against satellite and soil evidence to produce a ranked list of likely causes with a confidence score, not a single rigid guess
4. **Explanation** — generates a plain-language reason for the top cause that the farmer (or extension officer) can check against what they see on the ground

**Escalation logic:** when the symptom and remote data signals disagree (e.g. satellite trend is flat but farmer reports visible damage), the system explicitly flags low confidence and routes to a human rather than guessing.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router |
| API | Node.js, Express |
| AI reasoning | Claude API (Anthropic) |
| Satellite data | Sentinel-2 NDVI via open API |
| Soil data | iSDA Africa soil maps |
| Rainfall data | FAO WAPOR / open rainfall API |
| SMS fallback | Africa's Talking SMS gateway |
| Database | PostgreSQL (field registry and diagnosis log) |
| Maps | Mapbox GL JS (field boundary display) |

---

## Project structure

```
canesense/
├── README.md
├── .env.example
├── .gitignore
│
├── frontend/                           # React application
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx                     # Router and top-level layout
│       ├── index.js
│       │
│       ├── screens/
│       │   ├── MyFieldScreen.jsx       # Screen 1: field map + status badge
│       │   ├── ReportProblemScreen.jsx # Screen 2: guided symptom form
│       │   └── ResultScreen.jsx        # Screen 3: cause, confidence, action
│       │
│       ├── components/
│       │   ├── FieldMap.jsx            # Mapbox field boundary display
│       │   ├── StatusBadge.jsx         # healthy / caution / urgent pill
│       │   ├── ConfidenceBar.jsx       # visual confidence level indicator
│       │   ├── SymptomPicklist.jsx     # guided symptom selection (low-literacy)
│       │   └── EscalateButton.jsx      # "message an extension officer"
│       │
│       ├── api/
│       │   └── client.js               # wraps fetch calls to the backend
│       │
│       └── locales/
│           ├── en.json                 # English strings
│           └── sw.json                 # Swahili strings
│
├── backend/                            # Node / Express API
│   ├── package.json
│   ├── server.js                       # Express app entry point
│   │
│   ├── routes/
│   │   ├── fields.js                   # POST /fields, GET /fields/:id
│   │   ├── diagnose.js                 # POST /diagnose  ← core endpoint
│   │   └── sms.js                      # SMS / USSD fallback webhook
│   │
│   ├── services/                       # data fetchers — one file per source
│   │   ├── satelliteService.js         # Sentinel-2 NDVI trend for a field
│   │   ├── soilService.js              # iSDA soil baseline for a location
│   │   ├── rainfallService.js          # recent rainfall and water-balance
│   │   └── geocodeService.js           # field boundary → lat/lon centroid
│   │
│   ├── reasoning/                      # AI fusion and diagnosis logic
│   │   ├── diagnoseEngine.js           # combines symptom + 3 data sources
│   │   ├── confidenceScorer.js         # ranks causes, computes confidence
│   │   ├── agronomyRules.js            # symptom-pattern rules from agronomy sources
│   │   └── explainOutput.js            # turns ranked result into plain-language text
│   │
│   ├── models/
│   │   ├── Field.js                    # field boundary and farmer registration
│   │   └── DiagnosisLog.js             # stores past diagnoses for feedback tracking
│   │
│   ├── data/
│   │   └── stress-patterns.json        # static agronomic reference data
│   │
│   └── config/
│       └── dataSources.js              # API keys and endpoints per data source
│
├── shared/
│   └── constants.js                    # stress types, confidence thresholds, status levels
│
└── docs/
    ├── architecture.md                 # system architecture overview
    └── demo-script.md                  # the 6-step demo flow for judges
```

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- An Anthropic API key (for the reasoning engine)

### 1. Clone the repo

```bash
git clone https://github.com/your-org/canesense.git
cd canesense
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Fill in the values — see Environment variables section below
```

### 4. Set up the database

```bash
cd backend
npm run db:migrate
```

### 5. Run the development servers

```bash
# Terminal 1 — backend (runs on port 4000)
cd backend
npm run dev

# Terminal 2 — frontend (runs on port 3000)
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Environment variables

Copy `.env.example` to `.env` and fill in the following:

```env
# Anthropic (reasoning engine)
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/canesense

# Satellite data
SENTINEL_API_KEY=
SENTINEL_API_URL=

# Soil data (iSDA)
ISDA_API_KEY=
ISDA_API_URL=https://api.isda-africa.com/v1

# Rainfall data
RAINFALL_API_KEY=
RAINFALL_API_URL=

# SMS fallback (Africa's Talking)
AT_API_KEY=
AT_USERNAME=
AT_SENDER_ID=CANESENSE

# Maps (Mapbox)
MAPBOX_TOKEN=

# App
PORT=4000
NODE_ENV=development
```

---

## API reference

### `POST /fields`

Register a new field for a farmer.

**Request body**
```json
{
  "farmer_id": "f_001",
  "name": "Lower plot near road",
  "lat": -0.3031,
  "lng": 34.7617,
  "boundary_geojson": { ... }
}
```

**Response**
```json
{
  "field_id": "fld_abc123",
  "status": "healthy",
  "last_checked": null
}
```

---

### `POST /diagnose`

Submit a symptom report and receive a diagnosis.

**Request body**
```json
{
  "field_id": "fld_abc123",
  "crop_stage_weeks": 20,
  "symptom": "Leaves yellowing from the tip, lower side of the field near the road",
  "recent_rain": false,
  "photo_url": null
}
```

**Response**
```json
{
  "top_cause": "water_stress",
  "confidence": "high",
  "confidence_score": 0.78,
  "reasoning": "Your field has had no rain for 16 days. The satellite image shows the same yellowing pattern in the lower part of your field that you described. This does not look like a soil or pest problem.",
  "recommendation": "Irrigate the lower third of the field this week if possible.",
  "cost_saving": "Skipping fertilizer this round saves approximately KES 1,500.",
  "escalate": false,
  "escalation_reason": null,
  "data_used": {
    "ndvi_trend": "declining",
    "rainfall_gap_days": 16,
    "soil_nitrogen": "adequate"
  }
}
```

**Escalation response (low confidence)**
```json
{
  "top_cause": "unknown",
  "confidence": "low",
  "confidence_score": 0.31,
  "escalate": true,
  "escalation_reason": "Symptom and satellite data do not agree. A field visit is recommended."
}
```

---

### `GET /fields/:field_id`

Get the current status and last diagnosis for a field.

---

### `POST /sms`

Webhook endpoint for the Africa's Talking SMS gateway. Accepts a farmer's symptom via SMS and returns a compressed result message.

---

## Data sources

| Source | What it provides | How it is used |
|--------|-----------------|----------------|
| [Sentinel-2](https://sentinel.esa.int/) | Satellite NDVI vegetation index | Detects declining plant health trend by field location |
| [iSDA Africa](https://www.isda-africa.com/isdasoil/) | Soil nutrient baseline (N, P, pH) | Rules out nutrient deficiency or confirms it |
| [FAO WAPOR](https://www.fao.org/in-action/remote-sensing-for-water-productivity/en) | Rainfall and water productivity | Confirms or rules out water stress |
| [Land Soil Crop Hub Kenya](https://kenya.lsc-hubs.org/) | Soil and cropland maps | Soil context for Kenya-specific fields |
| [Infonet-Biovision](https://www.infonet-biovision.org/crops-fruits-vegetables/sugarcane) | Sugarcane agronomy and pest guide | Symptom-pattern classification rules |
| [CABI Bioprotection Portal](https://bioprotectionportal.com/) | Organic and biological pest inputs | Low-cost input recommendations |
| [Greenlife Kenya](https://www.greenlife.co.ke/) | Fertilizer recommendation tables | Input cost and application guidance |

---

## Running the demo

The demo follows a 6-step script — see [`docs/demo-script.md`](docs/demo-script.md) for the full walkthrough. In short:

1. Open the app and select a registered field
2. Enter symptom: *"leaves yellowing from the tip, lower part of the field"*
3. Watch the system pull satellite, rainfall, and soil data — briefly visible as a loading step
4. Receive a high-confidence result: water stress, plain-language reasoning, one action, estimated KES saved
5. Submit a second symptom (leaf holes, flat satellite trend) to trigger the low-confidence escalation path
6. View the SMS fallback version of the same result

---

## Contributing

This project was built for the Geospatial Spear Ltd challenge brief (Anthropic AI for Agriculture Hackathon).

To contribute:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

Please keep PRs focused on one change at a time and include a short description of what was changed and why.

---

*Canesense — because a sugarcane farmer deserves to know not just that something is wrong, but why.*
