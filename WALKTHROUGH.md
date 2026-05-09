# CRM Walkthrough & Feature Guide

This guide covers how to navigate the LeadFlow CRM and how the main features work. You can use this to prepare for the demo video or to understand the project structure.

---

## 🔑 Login & Access
*   **Test Account**: `admin@example.com`
*   **Password**: `password123`
*   The app uses **JWT (JSON Web Tokens)** for session management. Once you log in, your token is stored locally, allowing you to access the dashboard and pipeline.

---

## 📊 Dashboard Overview
The dashboard is the "heart" of the app. 
*   **KPI Cards**: Quick look at your sales performance (New, Won, Lost, etc.).
*   **Revenue Metrics**: Shows the total value of your pipeline and your actual "Won" revenue.
*   **Charts**: Using Recharts, I added visual breakdowns of where your leads are coming from (Sources) and how they are moving through the pipeline.
*   **Follow-ups**: A quick list of leads that need attention in the coming week.

---

## 📋 Managing the Pipeline
Go to the **Lead Pipeline** tab in the sidebar.
*   **Switching Views**: I added a toggle in the top right. You can use the standard **Table View** for lists, or the **Kanban View** to see cards grouped by status.
*   **Search**: You can search by name, company, or email. It filters as you type.
*   **Bulk Updates**: You can select multiple leads at once and change their status (e.g., moving several "Qualified" leads to "Won").
*   **CSV Export**: There's an export button to grab a spreadsheet of your current filtered list.

---

## 🔍 Lead Details & Enrichment
Click on any lead name to see the full record.
*   **Enrich Lead**: This is a simulated AI feature. Clicking "Enrich" will "fetch" data like company size and industry, adding it to your notes and updating the lead's priority score.
*   **Notes**: Standard internal updates for your team.
*   **Activity Timeline**: This is a bonus feature I added that logs every action—so you can see exactly when a status was changed and by whom.

---

## 🌓 Themes
*   I've implemented a **Dark Mode** toggle in the header. It’s fully persistent, so it remembers your preference even after a refresh.

---

## 🛠️ Technical Setup (Quick Reference)
*   **Backend**: Node.js/Express server. I used Sequelize as the ORM to communicate with MySQL.
*   **Frontend**: React (Vite) with Tailwind CSS for styling.
*   **Database**: MySQL. The schema is defined in `database/schema.sql`.

---
*Good luck with the submission!*
