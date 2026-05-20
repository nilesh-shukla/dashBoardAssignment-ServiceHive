# Smart Leads Dashboard ⚡

A high-performance, production-grade MERN Stack (React, Node.js, Express, MongoDB) application built with **TypeScript**, **TailwindCSS**, **Zustand**, and **Docker** to easily track, edit, and export sales leads.

---

## Features

- **Robust JWT Authentication & RBAC**: Secure endpoints and features utilizing Role-Based Access Control (Admins have full CRUD + CSV Export, Sales Representatives have viewing + status-updating capabilities).
- **Automated Mock Database Seeding**: Instantly generates 60 unique lead entries and pre-configured test users on first launch for direct, easy testing.
- **Advanced Lead Pipeline Queries**: Full filtering by acquisition source, lead status, custom search queries, pagination, and sorting.
- **500ms Debounced Searching**: In-built custom hook to throttle database queries during search keystrokes.
- **Admin CSV Export**: Seamless client-side streaming and downloading of full Mongoose lead records into standard CSV format.
- **Premium Glassmorphic Dashboard Design**: Modern aesthetic styling built on top of dark theme backgrounds with smooth transition micro-animations.
- **Centralized Operational Error Handling**: Standardized API failure structures rather than raw console dumps.
- **Containerized Ecosystem**: Direct, single-command initialization via Multi-container Docker Compose environments.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite (Fast compilation & HMR)
- **Language**: TypeScript
- **Styling**: TailwindCSS (Custom color palettes + custom glass-panels)
- **State Management**: Zustand
- **Form Management**: React Hook Form
- **Schema Validation**: Zod
- **Networking**: Axios (Request/Response Interceptors)
- **Icons**: Lucide React

### Backend
- **Platform**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose Schema Models
- **Auth Tokens**: JSON Web Tokens (JWT) + Bcryptjs
- **Validations**: Express Validator
- **File Processing**: Json2csv

---

## Directory Architecture

```txt
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connectivity
│   │   ├── controllers/     # Controller logics (Auth, Leads CRUD, Export)
│   │   ├── middlewares/     # JWT protection, RBAC checks, Error catches
│   │   ├── models/          # Mongoose models (User, Lead)
│   │   ├── routes/          # Express route structures
│   │   ├── types/           # Type definitions
│   │   ├── utils/           # Token generation, CSV exports, Seeder script
│   │   └── validations/     # Input validation arrays
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios base configurations
│   │   ├── components/      # Navigation, search bars, filters, forms, pagination
│   │   ├── hooks/           # useDebounce hook
│   │   ├── layouts/         # Main layout wrapper
│   │   ├── pages/           # Views (Login, Register, Dashboard, Details)
│   │   ├── routes/          # Protected route guard
│   │   ├── store/           # Zustand global state (authStore)
│   │   ├── types/           # Lead interface declarations
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## Pre-Configured Test Credentials

Upon startup, the system database automatically seeds these two user accounts for immediate testing:

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@leads.com` | `admin123` | Create, Read, Update, Delete Leads, Export CSV, Update Status |
| **Sales Representative** | `sales@leads.com` | `sales123` | Read Leads, View particulars, Update Lead Status |

---

## Local Setup & Launch

To launch the project, you can either run it directly on your machine or utilize **Docker Compose**.

### Option A: Running via Docker (Recommended)

1. Ensure **Docker** and **Docker Compose** are installed and active.
2. In the root directory (`smart-leads-dashboard/`), run:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   - **Frontend App**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`

---

### Option B: Manual Local Execution

#### 1. Database Setup
Ensure you have a MongoDB instance running locally on `mongodb://127.0.0.1:27017/` or set a custom `MONGO_URI` environment variable.

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

#### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

---

## Environment Variables Configuration

### Backend (`backend/.env`)
- `PORT`: Server port (Defaults to `5000`)
- `MONGO_URI`: MongoDB connection URI (e.g. `mongodb://127.0.0.1:27017/smart-leads`)
- `JWT_SECRET`: Security salt string used to sign credentials (e.g. `super_secret_key_for_smart_leads_dashboard_2026`)
- `NODE_ENV`: Process environment environment tag (`development` / `production`)

### Frontend (`frontend/.env`)
- `VITE_API_URL`: Targets the listening Express gateway URL (Defaults to `http://localhost:5000/api`)

---

## API Endpoints Table

All endpoints require a `Bearer <token>` authentication header, unless marked as **Public**.

| Verb | Path | Auth Scope | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Registers a new User (admin/sales) | `201 Created` |
| **POST** | `/api/auth/login` | Public | Signs in credentials and issues JWT | `200 OK` |
| **GET** | `/api/auth/me` | Protected | Fetches authenticated user's profile | `200 OK` |
| **GET** | `/api/leads` | Protected | Paginated, filtered search lists of leads | `200 OK` |
| **POST** | `/api/leads` | Protected | Registers/seeds a new Lead profile | `201 Created` |
| **GET** | `/api/leads/export` | Admin Only | Compiles database records into download CSV | `200 OK` |
| **GET** | `/api/leads/:id` | Protected | Fetches precise details of a single lead | `200 OK` |
| **PUT** | `/api/leads/:id` | Protected | Updates lead particulars/status | `200 OK` |
| **DELETE**| `/api/leads/:id` | Admin Only | Deletes a lead record permanently | `200 OK` |

---
