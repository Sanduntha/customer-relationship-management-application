const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lead_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150]
        }
    },
    company_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    lead_source: {
        type: DataTypes.ENUM('Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event', 'Advertisement', 'Other'),
        allowNull: false,
        defaultValue: 'Website'
    },
    assigned_salesperson: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'),
        allowNull: false,
        defaultValue: 'New'
    },
    estimated_deal_value: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    lead_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    next_follow_up: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'leads',
    timestamps: true
});

module.exports = Lead;
