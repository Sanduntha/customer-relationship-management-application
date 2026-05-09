const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LeadNote = sequelize.define('LeadNote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    note_content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    created_by: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'lead_notes',
    timestamps: true,
    updatedAt: false
});

module.exports = LeadNote;
