const User = require('./User');
const Lead = require('./Lead');
const LeadNote = require('./LeadNote');
const LeadActivity = require('./LeadActivity');

// Define associations

// User -> Leads (one-to-many)
User.hasMany(Lead, { foreignKey: 'created_by', as: 'leads' });
Lead.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Lead -> Notes (one-to-many)
Lead.hasMany(LeadNote, { foreignKey: 'lead_id', as: 'notes' });
LeadNote.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

// Lead -> Activities (one-to-many)
Lead.hasMany(LeadActivity, { foreignKey: 'lead_id', as: 'activities' });
LeadActivity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

module.exports = {
    User,
    Lead,
    LeadNote,
    LeadActivity
};
