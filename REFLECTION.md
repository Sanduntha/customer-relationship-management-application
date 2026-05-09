# Reflection Note - Intern Developer Full-Stack CRM Assessment

## Development Journey
The core focus of this project was to build a tool that isn't just a database entry form, but a functional workspace for a sales professional. I prioritized **Lead Scoring** and an **Activity Timeline** as the primary "Product Thinking" additions.

### Key Decisions:
1.  **Architecture**: Used a decoupled React frontend and Node.js backend. This allows for scalability and independent deployment.
2.  **State Management**: Leveraged React Context for authentication and standard hooks for local page state, keeping the bundle light.
3.  **Visual Management**: Implemented an interactive **Kanban Board** to provide a high-level overview of the sales pipeline, which is a significant UX improvement for sales teams.
4.  **Premium UX**: Built a **Dark Mode** system from the ground up using CSS variables, demonstrating attention to detail and modern design standards.
5.  **Database Design**: Chose an ACID-compliant MySQL structure with Sequelize. Relationships were carefully modeled to ensure that deleting a lead cleans up its notes and activities (Cascade).
6.  **Security**: Implemented JWT authentication and Bcrypt hashing for passwords.

### Challenges Overcome:
-   **Data Synchronization**: Ensuring that the dashboard updates accurately when leads are edited required a robust API response structure.
-   **Theme Switching**: Managing complex state transitions for the theme across third-party libraries like Recharts.

### Learning Outcomes:
This project reinforced the importance of **CRUD integrity**. Handling "Delete" with related data and "Bulk Update" for efficiency separates a basic app from a professional tool.

### Future Enhancements:
If I had more time, I would implement:
-   Webhooks for lead capture from external sites.
-   Email integration to track communications directly within the CRM.
-   Role-based access control (RBAC) where salespeople only see their own assigned leads.
