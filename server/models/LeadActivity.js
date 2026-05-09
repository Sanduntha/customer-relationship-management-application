const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeadActivity = sequelize.define('LeadActivity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activity_type: {
        type: DataTypes.ENUM('created', 'updated', 'status_changed', 'note_added', 'email_sent', 'call_made', 'meeting_scheduled'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    performed_by: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    old_value: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    new_value: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'lead_activities',
    timestamps: true,
    updatedAt: false
});

module.exports = LeadActivity;
