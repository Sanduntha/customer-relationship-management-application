-- =============================================
-- CRM Lead Management System - Database Schema
-- =============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS crm_leads_db;
USE crm_leads_db;

-- =============================================
-- Users Table
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'salesperson') DEFAULT 'salesperson',
    avatar_color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Leads Table
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    lead_source ENUM('Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Advertisement', 'Other') NOT NULL DEFAULT 'Website',
    assigned_salesperson VARCHAR(150),
    status ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost') NOT NULL DEFAULT 'New',
    estimated_deal_value DECIMAL(15, 2) DEFAULT 0.00,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    lead_score INT DEFAULT 0,
    next_follow_up DATE DEFAULT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- Lead Notes Table
-- =============================================
CREATE TABLE IF NOT EXISTS lead_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    note_content TEXT NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- =============================================
-- Lead Activities Table (Bonus - Activity Timeline)
-- =============================================
CREATE TABLE IF NOT EXISTS lead_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    activity_type ENUM('created', 'updated', 'status_changed', 'note_added', 'email_sent', 'call_made', 'meeting_scheduled') NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- =============================================
-- Seed Data - Test Users
-- =============================================
-- Password: password123 (bcrypt hashed)
INSERT INTO users (name, email, password, role, avatar_color) VALUES
('Admin User', 'admin@example.com', '$2b$10$WZjfEPAa50eU/8SYimXw5u5yQJWrqLIihZ8VpXm4JE3uxgcwp4j8.', 'admin', '#6366f1'),
('John Smith', 'john@example.com', '$2b$10$WZjfEPAa50eU/8SYimXw5u5yQJWrqLIihZ8VpXm4JE3uxgcwp4j8.', 'salesperson', '#ec4899'),
('Sarah Johnson', 'sarah@example.com', '$2b$10$WZjfEPAa50eU/8SYimXw5u5yQJWrqLIihZ8VpXm4JE3uxgcwp4j8.', 'salesperson', '#14b8a6');

-- =============================================
-- Seed Data - Sample Leads
-- =============================================
INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_salesperson, status, estimated_deal_value, priority, lead_score, next_follow_up, description, created_by) VALUES
('James Wilson', 'TechCorp Solutions', 'james@techcorp.com', '+1-555-0101', 'Website', 'John Smith', 'New', 25000.00, 'High', 75, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Interested in enterprise software solution', 1),
('Emily Chen', 'DataFlow Inc', 'emily@dataflow.io', '+1-555-0102', 'LinkedIn', 'Sarah Johnson', 'Contacted', 50000.00, 'Critical', 90, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Looking for data analytics platform', 1),
('Michael Brown', 'CloudNet Systems', 'michael@cloudnet.com', '+1-555-0103', 'Referral', 'John Smith', 'Qualified', 75000.00, 'High', 85, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Needs cloud infrastructure services', 1),
('Lisa Anderson', 'GreenTech Co', 'lisa@greentech.co', '+1-555-0104', 'Cold Email', 'Sarah Johnson', 'Proposal Sent', 120000.00, 'Critical', 95, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Sustainability tracking software', 1),
('Robert Taylor', 'FinanceHub Ltd', 'robert@financehub.com', '+1-555-0105', 'Event', 'John Smith', 'Won', 90000.00, 'Medium', 100, NULL, 'Financial reporting dashboard', 1),
('Amanda White', 'HealthPlus Corp', 'amanda@healthplus.com', '+1-555-0106', 'Website', 'Sarah Johnson', 'Lost', 35000.00, 'Low', 30, NULL, 'Patient management system - went with competitor', 1),
('David Lee', 'EduTech Academy', 'david@edutech.com', '+1-555-0107', 'LinkedIn', 'John Smith', 'New', 45000.00, 'Medium', 60, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Learning management platform', 1),
('Jennifer Martinez', 'RetailMax', 'jennifer@retailmax.com', '+1-555-0108', 'Advertisement', 'Sarah Johnson', 'Contacted', 65000.00, 'High', 70, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'POS and inventory system', 1),
('Thomas Garcia', 'LogiTrans Corp', 'thomas@logitrans.com', '+1-555-0109', 'Referral', 'John Smith', 'Qualified', 110000.00, 'Critical', 88, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Fleet management solution', 1),
('Sandra Kim', 'MediaWave Studios', 'sandra@mediawave.com', '+1-555-0110', 'Event', 'Sarah Johnson', 'Proposal Sent', 55000.00, 'Medium', 78, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'Content management platform', 1);

-- =============================================
-- Seed Data - Sample Notes
-- =============================================
INSERT INTO lead_notes (lead_id, note_content, created_by) VALUES
(1, 'Initial contact made via website form. Interested in premium plan.', 'Admin User'),
(1, 'Scheduled a demo call for next week.', 'John Smith'),
(2, 'Connected on LinkedIn. Very responsive. Has budget approved.', 'Sarah Johnson'),
(3, 'Referred by existing client Robert Taylor. High potential deal.', 'John Smith'),
(4, 'Proposal sent for sustainability tracking module. Awaiting review.', 'Sarah Johnson'),
(5, 'Deal closed! Annual contract signed. Onboarding starts next month.', 'John Smith'),
(6, 'Lost to competitor offering lower price. Follow up in 6 months.', 'Sarah Johnson');

-- =============================================
-- Seed Data - Sample Activities
-- =============================================
INSERT INTO lead_activities (lead_id, activity_type, description, performed_by, old_value, new_value) VALUES
(1, 'created', 'Lead created', 'Admin User', NULL, NULL),
(1, 'note_added', 'Added note about initial contact', 'Admin User', NULL, NULL),
(2, 'created', 'Lead created', 'Admin User', NULL, NULL),
(2, 'status_changed', 'Status updated from New to Contacted', 'Sarah Johnson', 'New', 'Contacted'),
(3, 'created', 'Lead created', 'Admin User', NULL, NULL),
(3, 'status_changed', 'Status updated from New to Qualified', 'John Smith', 'New', 'Qualified'),
(4, 'created', 'Lead created', 'Admin User', NULL, NULL),
(4, 'status_changed', 'Status updated to Proposal Sent', 'Sarah Johnson', 'Qualified', 'Proposal Sent'),
(5, 'created', 'Lead created', 'Admin User', NULL, NULL),
(5, 'status_changed', 'Deal Won! Contract signed.', 'John Smith', 'Proposal Sent', 'Won'),
(6, 'created', 'Lead created', 'Admin User', NULL, NULL),
(6, 'status_changed', 'Lead lost to competitor', 'Sarah Johnson', 'Contacted', 'Lost');
