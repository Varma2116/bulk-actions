const fs = require('fs');
const csv = require('csv-parser');
const BulkAction = require('../models/BulkAction');
const bulkActionService = require('../services/bulkActionService');

const logger = require('../config/logger');
const { QUEUE_NAME } = require('../utils/Constants');
const { getChannel } = require('../utils/rabbitmq');

exports.listBulkActions = async (req, res) => {
    try {
        //default values to fetch the data
        const { page = 1, limit = 10 } = req.query;

        try {
            const actions = await BulkAction.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await BulkAction.countDocuments();

            res.json({
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit),
                actions
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBulkAction = async (updateData, entityVal, res) => {
    try {   
        const entity = entityVal.toLowerCase();     
        const fieldsToUpdate = updateData.filter(data=> data?.email != null);

        const bulkAction = await BulkAction.create({
            entity,
            fieldsToUpdate,
            status: 'pending'
        });bulkAction

        const channel = getChannel();
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ bulkActionId: bulkAction._id })));
        res.status(201).json(bulkAction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};


exports.getBulkAction = async (req, res) => {
    try {
        const action = await BulkAction.findById(req.params.actionId);
        if(!action){
            res.status(400).json({ "message": "Action not found"});
        }
        res.json(action);
    } catch (err) {
        logger.warn(`Bulk action not found: ${req.params.actionId}`);
        res.status(400).json({ error: "Bulk action not found" });
    }
};

exports.getBulkActionStats = async (req, res) => {
    try {
        const stats = await bulkActionService.getBulkActionStats(req.params.actionId);
        if(stats == null){
            return res.status(400).json({ "message": "Action not found"});
        }
        res.json(stats);
    } catch (err) {
        logger.warn(`Bulk action not found: ${req.params.actionId}`);
        res.status(500).json({ error: err.message });
    }
};

exports.scheduleBulkAction = async (updateData, entityVal, scheduledAt, res) => {
    try {   
        const entity = entityVal.toLowerCase();     
        const fieldsToUpdate = updateData.filter(data=> data?.email != null);

        const bulkAction = await BulkAction.create({
            entity,
            fieldsToUpdate,
            status: 'pending'
        });

        const action = await bulkActionService.scheduleBulkAction(bulkAction._id, new Date(scheduledAt));
        res.status(201).json(action);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}