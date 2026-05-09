# LeadFlow CRM - Backend (Server)

This is the Node.js/Express backend for the LeadFlow CRM.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=crm_leads_db
   JWT_SECRET=your_secret_key
   ```

3. **Run Server**:
   ```bash
   npm run dev
   ```

## 🛠️ Key Technologies
- **Express 5**: Fast, unopinionated web framework.
- **Sequelize**: Promise-based Node.js ORM for MySQL.
- **JWT**: Secure authentication.
- **Bcrypt**: Password hashing.

## 📁 API Endpoints
- `/api/auth`: Login and user management.
- `/api/leads`: Lead CRUD and pipeline stats.
- `/api/dashboard`: Aggregated analytics data.
- `/api/leads/:id/notes`: Note management.
