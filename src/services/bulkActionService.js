const BulkAction = require('../models/BulkAction');
const { getChannel } = require('../utils/rabbitmq');
const batchProcessor = require('./batchProcessor');
const ScheduledTask = require('../models/ScheduledTask');
const { QUEUE_NAME } = require('../utils/Constants')
const logger = require('../config/logger');

const createBulkAction = async (data) => {
    const bulkAction = new BulkAction(data);
    await bulkAction.save();

    const channel = getChannel();
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ bulkActionId: bulkAction._id })));
    logger.info(`Bulk action created with ID: ${bulkAction._id}`);

    return bulkAction;
};

const getBulkActionStats = async (actionId) => {
    const action = await BulkAction.findById(actionId);
    if (!action) {
        return null;   
    }

    return {
        entity: action.entity,
        total: action.total,
        successCount: action.successCount,
        failureCount: action.failureCount,
        skippedCount: action.skippedCount
    };
};

// Consumer
const consumeMessages = () => {
    const channel = getChannel();
    let retryCount = 0;
    const MAX_RETRIES = 3;
    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            const { bulkActionId } = JSON.parse(msg.content.toString());
            console.log(`Received bulk action ID: ${bulkActionId}`);
    
            try {
                await batchProcessor.processBatch(bulkActionId);
                console.log(`Update processed for bulk action ID: ${bulkActionId}`);
                channel.ack(msg);
            } catch (error) {
                console.error('Error processing message:', error.message);
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`Retrying message processing (Attempt ${retryCount} of ${MAX_RETRIES})`);
                    setTimeout(() => channel.nack(msg), 5000); // Retry after 5 seconds
                } else {
                    console.error('Maximum retries reached. Could not process message.');
                    channel.ack(msg); // Acknowledge message to avoid infinite retries
                }
            }
        }
    });
};

const scheduleBulkAction = async (bulkActionId, scheduledAt) => {
    const scheduledTask = new ScheduledTask({ bulkActionId, scheduledAt });
    await scheduledTask.save();
    return scheduledTask;
};

const executeBulkAction = async (bulkActionId) => {
    logger.info("Started Execute Bulk Action for")
    const channel = getChannel();
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ bulkActionId })));
};

module.exports = { createBulkAction, getBulkActionStats, scheduleBulkAction, executeBulkAction, consumeMessages };
