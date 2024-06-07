const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    bulkActionId: { type: mongoose.Schema.Types.ObjectId, ref: 'BulkAction', required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    status: { type: String, enum: ['success', 'failure', 'skipped'], required: true },
    errorDetails: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('logs', LogSchema);