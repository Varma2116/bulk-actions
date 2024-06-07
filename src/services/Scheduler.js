const cron = require('node-cron');
const ScheduledTask = require('../models/ScheduledTask');
const bulkActionService = require('../services/bulkActionService');
const logger = require('../config/logger');

const cronScheduler = () => {
    cron.schedule('* * * * * *', async () => {
        logger.info("Schedule cron started running");
        
        try {
            const tasks = await ScheduledTask.find({ status: 'scheduled', scheduledAt: { $lte: new Date() } });
            
            for (const task of tasks) {
                logger.info(`Cron started running for the action id: ${task._id.toString()}`);
                
                await bulkActionService.executeBulkAction(task.bulkActionId);
                
                task.status = 'executed';
                await task.save();
            }
        } catch (error) {
            logger.error(`Error occurred in cron job: ${error.message}`);
        }
    });
};

module.exports = cronScheduler;
