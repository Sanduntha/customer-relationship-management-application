# 🚀 LeadFlow CRM - Full-Stack Sales Management System

LeadFlow CRM is a professional, high-performance Customer Relationship Management application built for small sales teams. It enables tracking of leads, managing the sales pipeline, recording activity logs, and visualizing performance analytics with a premium enterprise user experience.

---

## ✨ Features

### 🏢 Core CRM Functionality
*   **🔒 Secure Authentication**: JWT-based login system with persistent sessions and password hashing (`bcrypt`).
*   **📂 Lead Management (CRUD)**: Full suite of tools to create, view, edit, and delete leads.
*   **📑 Lead Details**: Track comprehensive data: company name, source, value, priority, and custom descriptions.
*   **📋 Pipeline Tracking**: Manage leads through stages: *New → Contacted → Qualified → Proposal Sent → Won/Lost*.
*   **📝 Interactive Notes**: Add internal updates to any lead with automatic author and timestamp tracking.
*   **🔍 Search & Filtering**: Advanced real-time search (name, company, email) and multi-parameter filters.

### 🌟 Bonus & Advanced Features
*   **📊 Performance Dashboard**: Real-time analytics with visual charts (`Recharts`) for pipeline and source distribution.
*   **📋 Visual Kanban Board**: Toggle between high-density table view and a visual pipeline board for better workflow.
*   **🌓 Dynamic Theme Support**: Premium Light and Dark modes with persistent user preferences.
*   **✨ AI Data Enrichment**: Simulate lead data enrichment (company info, social profiles) with a single click.
*   **🕒 Activity Audit Log**: Automatic timeline of every change made to a lead for full accountability.
*   **📈 Lead Scoring & Priority**: Automated scoring (0-100) and priority levels to help teams focus on high-value deals.
*   **⚡ Bulk Operations**: Update the status of multiple leads simultaneously to save time.
*   **📥 CSV Export**: Export lead data for external reporting or offline processing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Recharts, React Router 7 |
| **Backend** | Node.js, Express.js 5, Sequelize ORM |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Tokens) & Bcrypt |

---

## 📁 Project Structure

```text
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI (Kanban, Layout, etc.)
│   │   ├── context/     # Auth & Theme State
│   │   ├── pages/       # Dashboard, Leads, Forms
│   │   └── services/    # API Axios instances
├── server/              # Node.js Express backend
│   ├── controllers/     # API Logic
│   ├── models/          # Sequelize Models (MySQL)
│   ├── routes/          # Express Route definitions
│   └── middleware/      # Auth & Error handling
└── database/            # SQL Schema and Seed data
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   MySQL Server

### 2. Database Setup
1. Create a database named `crm_leads_db`.
2. Import `database/schema.sql` into your MySQL server. This will create all tables and populate them with **sample data**.

### 3. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your MySQL credentials
npm run dev
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables (Server)
Create a `.env` file in the `server` directory:
- `DB_HOST`: `localhost`
- `DB_USER`: `root`
- `DB_PASSWORD`: `1234`
- `DB_NAME`: `crm_leads_db`
- `JWT_SECRET`: `(any strong string)`
- `CLIENT_URL`: `http://localhost:5173`

---

## 🔑 Test Credentials
*   **Admin Email**: `admin@example.com`
*   **Password**: `password123`

---

## 🎥 Demo & Documentation
*   **Demo Video**: [https://drive.google.com/file/d/1rAKC-1jPYnFm7c0Kz9jYlSszPlaqo6CN/view?usp=sharing](https://drive.google.com/file/d/1rAKC-1jPYnFm7c0Kz9jYlSszPlaqo6CN/view?usp=sharing)
*   **Development Reflection**: See [REFLECTION.md](./REFLECTION.md)
*   **Technical Walkthrough**: See [WALKTHROUGH.md](./WALKTHROUGH.md)

---
*Developed for the Intern Assessment 2026. Designed for performance, built for sales.*
