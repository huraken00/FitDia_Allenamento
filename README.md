# FitDia — Workout Management Module

Full-stack web application developed as the **Workout Management module** of **FitDia**, a modular fitness platform built across multiple development teams. While nutrition features were handled by a separate team, this module manages workout planning, exercise catalogs, progress tracking, and **AI-assisted exercise generation** powered by **Google Generative AI (Gemini)**.

## Key Features

- **Generative AI Exercise Creation:** Integrates `@google/generative-ai` to dynamically generate tailored exercises and training variants.
- **Workout & Progress Tracking:** Full CRUD workflows for creating, editing, and logging workouts, sets (`serie`), exercise parameters, and sport categories, paired with visual progress charts (`GraficoProgressi`).
- **Role-Based Access Control (RBAC):** Dedicated interfaces and JWT-protected REST endpoints for three user roles:
  - **User:** Manages personal workouts, tracks sets and progress over time, searches exercises, and explores variants.
  - **Training Expert (`Esperto Allenamento`):** Creates, updates, and curates exercises and exercise variants.
  - **Director (`Direttore`):** Oversees registered users and manages training expert accounts.
- **Secure Backend Architecture:** Modular Express + Mongoose REST API with request validation (`express-validator`), password hashing (`bcryptjs`), and token-based authentication (`jsonwebtoken`).

## Tech Stack

- **Frontend:** React, Vite, CSS Modules, Context API
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication & Validation:** JWT, bcryptjs, express-validator
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`)

## Project Structure

```text
FitDia_Allenamento/
├── backend/
│   ├── controllers/     # Business logic (workouts, exercises, sets, users, roles)
│   ├── models/          # Mongoose schemas (User, Allenamento, Esercizio, Serie, Sport, ...)
│   ├── routes/          # Express API routes
│   └── index.js         # Server entry point
└── frontend/
    └── src/
        ├── components/           # Shared UI components (charts, modals, search, sets)
        ├── user/                 # User dashboard, workouts, and progress tracking pages
        ├── esperto_allenamento/  # Training expert exercise management pages
        ├── director/             # Director administration pages
        └── shared/               # Auth context and form validation utilities
```
## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster or local MongoDB instance
- Google Gemini API key

### 1. Clone the repository
```bash
git clone [https://github.com/huraken00/FitDia_Allenamento.git](https://github.com/huraken00/FitDia_Allenamento.git)
cd FitDia_Allenamento
```

### 2. Configure and run the backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (see `backend/.env.example`):
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
SECRET_KEY=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the server:
```bash
npm start
```

### 3. Run the frontend
```bash
cd ../frontend
npm install
npm run dev
```
