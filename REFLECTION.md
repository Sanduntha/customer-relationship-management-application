# Reflection: Building LeadFlow CRM

### My Development Process
When I started this project, I wanted to create more than just a simple data entry tool. My goal was to build a system that feels like a real "sales cockpit"—something a salesperson would actually want to use every day to stay organized.

### Key Technical Decisions
*   **Full-Stack Architecture**: I went with a decoupled React/Node stack. It's my preferred way of building because it keeps the concerns separate and makes the app feel snappy with client-side routing.
*   **Dynamic UX (Kanban & Dark Mode)**: I spent extra time building the Kanban view and a robust dark mode system. In a real CRM, visual organization is everything, and these features make the pipeline much easier to manage.
*   **Database Integrity**: I used Sequelize for the backend. I made sure to implement proper foreign key relationships so that when a lead is deleted, all associated notes and activity logs are cleaned up too. This prevents "orphan" data which is a common issue in smaller apps.
*   **JWT Security**: I chose JWT for authentication to ensure that the CRM data remains protected behind a secure login, which is critical for sensitive lead information.

### Challenges I Faced
*   **State Management**: One of the trickier parts was making sure the dashboard charts updated correctly as soon as a lead's status changed. I had to refine my API responses to return the full updated state to keep the UI in sync.
*   **Theme Continuity**: Ensuring the dark mode looked consistent across third-party components (like Recharts) took a bit of fine-tuning with CSS variables.

### What I Learned
This assessment really pushed me to think about **data persistence** and **user workflow**. It's one thing to build a form, but another to build an "Activity Timeline" that records every single change—that’s what makes a CRM a professional tool.

### If I Had More Time...
I'd love to add:
*   Real-time email integration (Sendgrid/Nodemailer).
*   Role-based access (where sales reps only see their own assigned leads).
*   A "Next Action" suggestion engine based on lead score.
