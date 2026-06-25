# Architecture

## Overview
Canesense is a full-stack application built with React, Node.js, Express, and a Neo4j database. It helps sugarcane farmers diagnose crop stress using agronomic rules and AI (Featherless API).

## Components

1. **Frontend (React)**:
   - Uses React Router for navigation.
   - Tailwind CSS for styling.
   - Communicates with the backend via REST API.

2. **Backend (Node.js/Express)**:
   - REST API for fields, diagnosis, and SMS fallback.
   - `diagnoseEngine.js`: Combines external data (satellite, soil, rainfall) with farmer input.
   - Neo4j database (stubbed): For tracking fields, diagnoses, and relationships.

3. **External Services (Mocked)**:
   - Satellite Service (NDVI)
   - Soil Service (Nitrogen, pH)
   - Rainfall Service (Precipitation gap)

## Data Flow
1. Farmer reports a problem on the frontend.
2. The backend receives the data and fetches external signals.
3. `diagnoseEngine` evaluates the signals using agronomic rules or Featherless AI.
4. A diagnosis result is returned and saved to the database.
