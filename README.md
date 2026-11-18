# SafeHome-Web

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-v7.1-ca4245.svg)](https://reactrouter.com/)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](https://github.com/DineethKonakalla703/SafeHome-Web)

**SafeHome-Web** is the modern web single-page application (SPA) portal for the SafeHome Residential Service CRM. Built on React 18 and Vite, it delivers responsive, role-delineated dashboards, complaint filing, work-order dispatching, financial ledgers, visitor gate management, and conversational AI knowledge interfaces.

---

## 1. Key Features

- **Role-Based Portals:** Tailored user experiences for `MAIN_ADMIN`, `BLOCK_SUB_ADMIN`, `FACILITY_MANAGER`, `TECHNICIAN`, `RESIDENT`, and `SECURITY`.
- **Defensive Route Guarding:** Declarative client route protection (`ProtectedPage.jsx`) checking active JWT sessions in `localStorage` and intercepting unauthorized URL access.
- **Robust API Client:** Centralized HTTP abstraction (`apiClient.js`) that automatically attaches Bearer tokens, manages multipart file uploads for maintenance photos, and triggers clean session resets on `401 Unauthorized` responses.
- **Service Request Lifecycle:** Interactive ticket creation with photo attachments, live status timelines, priority tags, and technician assignment.
- **Knowledge & AI Support:** Direct integration with the SafeHome GraphRAG knowledge base, providing grounded SOP searches and conversational resident assistance.
- **Comprehensive CRM Views:** Property directory, tenant registries, itemized maintenance invoicing, amenity slot booking, visitor logging, and system audit logs.

---

## 2. Technology Stack

- **Framework:** React 18.3
- **Build Tool:** Vite 8.3
- **Routing:** React Router v7
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Custom plain CSS with modern design tokens
- **E2E Testing:** Playwright (`@playwright/test`)
- **Containerization:** Docker with multi-stage build & Nginx alpine

---

## 3. Directory Structure

```text
SafeHome-Web/
├── public/                       # Static public assets & favicons
├── src/
│   ├── ai/                       # Frontend AI state & streaming helpers
│   ├── api/                      # Domain API client modules (25 services)
│   │   ├── apiClient.js          # Core fetch wrapper with auth header injection
│   │   ├── ticketApi.js          # Ticket CRUD operations
│   │   ├── workOrderApi.js       # Technician work order synchronization
│   │   ├── knowledgeApi.js       # RAG knowledge base search
│   │   └── chatbotApi.js         # Resident conversational assistant
│   ├── components/               # Reusable UI widgets & layouts
│   │   ├── Layout.jsx            # Main app shell with sidebar & top navigation
│   │   ├── ProtectedPage.jsx     # Route-level authentication guard
│   │   ├── StatusBadge.jsx       # Priority and status pill renderer
│   │   └── Modal.jsx             # Accessible modal dialogue
│   ├── data/                     # Offline reference dictionaries
│   ├── pages/                    # 20+ Role-specific view components
│   │   ├── AdminDashboard.jsx    # Estate administration overview
│   │   ├── ResidentDashboard.jsx # Resident dues, complaints, notices
│   │   ├── TechnicianDashboard.jsx # Work orders & photo completion
│   │   ├── CreateComplaint.jsx   # Interactive complaint filing
│   │   ├── TicketDetails.jsx     # Ticket case file & timeline
│   │   └── KnowledgeSearch.jsx   # GraphRAG knowledge portal
│   ├── styles/                   # Global style sheets & themes
│   ├── utils/                    # Client auth utilities, storage helpers
│   ├── App.jsx                   # Master route configuration
│   ├── index.css                 # Base CSS rules & typography
│   └── main.jsx                  # React DOM root entry point
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git tracking rules
├── Dockerfile                    # Multi-stage production container
├── index.html                    # HTML document template
├── nginx.conf                    # Nginx reverse proxy configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation
```

---

## 4. Installation & Setup

### Prerequisites
- Node.js >= 18.x installed
- SafeHome-Backend running (default at `http://localhost:5000`)

### Installation
```bash
# Clone the repository
git clone https://github.com/DineethKonakalla703/SafeHome-Web.git
cd SafeHome-Web

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your backend URL:
```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api
```

The backend is deployed at `https://safehome-backend-production.up.railway.app` (health check: `/api/health`). If `VITE_API_BASE_URL` is not set, a production build (`npm run build`) uses that deployment and `npm run dev` uses `http://localhost:5000/api`.

---

## 5. Startup & Running Commands

```bash
# Start Vite development server (default port: 5173)
npm run dev

# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview

# Run Playwright end-to-end tests
npm run test:e2e
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Default Demo Credentials (from Seed)
- **Main Admin:** `admin@safehome.com` / `Demo@123`
- **Facility Manager:** `fm@safehome.com` / `Demo@123`
- **Technician:** `technician1@safehome.com` / `Demo@123`
- **Resident:** `resident1@safehome.com` / `Demo@123`

---

## 6. Docker Deployment

```bash
# Build Docker image
docker build -t safehome-web .

# Run container (mapped to port 80)
docker run -p 80:80 safehome-web
```

---

## 7. License

Proprietary / Academic Capstone Project · Developed by Dineeth Konakalla.
