const mongoose = require('mongoose');

const ScheduledTaskSchema = new mongoose.Schema({
    bulkActionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'BulkAction', 
        required: true 
    },
    scheduledAt: {
        type: Date, 
        required: true 
    },
    status: {
        type: String, 
        enum: ['scheduled', 'executed'], 
        default: 'scheduled' 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('ScheduledTask', ScheduledTaskSchema);