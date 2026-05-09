# Reflection Note - Intern Developer Full-Stack CRM Assessment

## Development Journey
The core focus of this project was to build a tool that isn't just a database entry form, but a functional workspace for a sales professional. I prioritized **Lead Scoring** and an **Activity Timeline** as the primary "Product Thinking" additions.

### Key Decisions:
1.  **Architecture**: Used a decoupled React frontend and Node.js backend. This allows for scalability and independent deployment.
2.  **State Management**: Leveraged React Context for authentication and standard hooks for local page state, keeping the bundle light.
3.  **Database Design**: Chose an ACID-compliant MySQL structure. Relationships were carefully modeled to ensure that deleting a lead cleans up its notes and activities (Cascade).
4.  **Security**: Implemented JWT with HTTP-only tokens (simulation via localStorage for simplicity) and Bcrypt hashing for passwords.

### Challenges Overcome:
-   **Data Synchronization**: Ensuring that the dashboard updates accurately when leads are edited required a robust API response structure where the updated model is returned with its associations.
-   **UI Consistency**: Building a premium "Dark Mode" aesthetic required careful selection of a color palette (Indigo/Slate/Emerald) to ensure high contrast and readability.

### Learning Outcomes:
This project reinforced the importance of **CRUD integrity**. It's easy to make a "Create" button, but handling "Delete" with related data and "Bulk Update" for efficiency separates a basic app from a professional tool.

### Future Enhancements:
If I had more time, I would implement:
-   Webhooks for lead capture from external sites.
-   A Kanban board view for the sales pipeline.
-   Role-based access control (RBAC) where salespeople only see their own leads.
