# Real-Time ISS & News Dashboard

## Overview
A comprehensive React + Vite web application that tracks the International Space Station (ISS) in real-time, displays the latest space and technology news, and includes an AI chatbot assistant that answers questions based strictly on the live dashboard data.

## Features
- **Real-Time ISS Tracking**: Fetches ISS location every 15 seconds.
- **Live Map & Trajectory**: Visualizes the ISS path on an interactive Leaflet map.
- **ISS Telemetry**: Calculates speed using the Haversine formula and displays live coordinates.
- **Reverse Geocoding**: Shows the nearest city, country, or geographical feature to the ISS.
- **Astronauts List**: Displays the crew currently aboard the ISS.
- **Live News Feed**: Fetches top technology and science headlines via the GNews API, with filtering and 15-minute caching.
- **AI Contextual Chatbot**: Features a Hugging Face-powered assistant (`mistralai/Mistral-7B-Instruct-v0.2`) scoped entirely to the dashboard context.
- **Interactive Charts**: Line chart for ISS speed history and Pie chart for news category distribution.
- **Responsive UI**: Dark/Light mode, clean typography, loading states, and error handling.

## Tech Stack
- React 19, Vite
- Tailwind CSS 4
- React Leaflet
- Recharts
- Lucide React
- React Hot Toast
- Hugging Face Inference API
- GNews API, Open Notify API

## Setup & Running Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Duplicate `.env.example` to `.env` and fill in your API keys.
4. Start the dev server: `npm run dev`

## Deployment
This project is deployment-ready for Vercel.
1. Push your code to a GitHub repository.
2. Import the project in your Vercel Dashboard.
3. Add the Environment Variables (`VITE_NEWS_API_KEY` and `VITE_AI_TOKEN`) in the Vercel project settings.
4. Deploy (Vercel will use `npm run build` automatically).

## Assignment Question
**Which LLM model did you use in this application, and why?**
We used mistralai/Mistral-7B-Instruct-v0.2 via Hugging Face because it matched the assignment requirement and works well for instruction-following chatbot behavior. The chatbot was additionally restricted to answer only from the live dashboard context.
