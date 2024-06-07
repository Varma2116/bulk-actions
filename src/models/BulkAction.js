const mongoose = require('mongoose');

const bulkActionSchema = new mongoose.Schema({
    entity: {
        type: String,
        required: true
    },
    fieldsToUpdate: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    successCount: {
        type: Number,
        default: 0
    },
    failureCount: {
        type: Number,
        default: 0
    },
    skippedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const BulkAction = mongoose.model('BulkAction', bulkActionSchema);

module.exports = BulkAction;
