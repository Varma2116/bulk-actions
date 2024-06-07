const mongoose = require('mongoose');
const BulkAction = require('../models/BulkAction');
const Contact = require('../models/Contact');
const Log = require('../models/Log');
const logger = require('../config/logger');

const BATCH_SIZE = 100; // Define batch size for fetching data from the database

exports.processBatch = async (bulkActionId) => {
    const bulkAction = await BulkAction.findById(bulkActionId);
    if (!bulkAction) {
        logger.error(`Bulk action not found: ${bulkActionId}`);
        throw new Error('Bulk action not found');
    }
    const { entity, fieldsToUpdate } = bulkAction;

    let entityModel = getEntity(entity);

    const emailSet = new Set();
    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;
    const results = [];

    const processBulkData = async (bulkDataBatch, bulkEmailContactMap) => {        
        for (const fieldData of bulkDataBatch) {
            if (emailSet.has(fieldData?.email)) {
                await new Log({ bulkActionId, entityId: null, status: 'skipped', errorDetails: 'Duplicate email' }).save();
                logger.warn(`Duplicate email for bulk action email: ${fieldData?.email}`);
                skippedCount++;
                continue;
            }
            emailSet.add(fieldData?.email);

            let entity;
            try {
                entity = bulkEmailContactMap.get(fieldData?.email);
                console.log(entity, fieldData?.email);
                if (!entity) {
                    failureCount++;
                    await new Log({ bulkActionId, entityId: null, status: 'failure', errorDetails: 'Entity not found' }).save();
                    logger.warn(`Entity not found for email: ${fieldData?.email}`);
                    continue;
                }
            } catch (err) {
                failureCount++;
                logger.error(`Error finding entity for email: ${fieldData?.email}, Error: ${err.message}`);
                await new Log({ bulkActionId, entityId: null, status: 'failure', errorDetails: `Error finding entity: ${err.message}` }).save();
                continue;
            }

            let logEntry = { bulkActionId: bulkActionId.toString(), entityId: entity._id.toString(), status: 'success' };
            try {
                for(let key in Object.keys(fieldData)){
                    if(key != "email"){
                        entity[key] = fieldData[key];
                    }
                }
                successCount++;
            } catch (err) {
                logEntry.status = 'error';
                logEntry.errorDetails = err.message;
                failureCount++;
                logger.error(`Error updating entity ID: ${entity._id}, Error: ${err.message}`);
            }
            await new Log(logEntry).save();
            results.push(logEntry);
        }
    };

    for (let i = 0; i < fieldsToUpdate.length; i += BATCH_SIZE) {
        const bulkDataBatch = fieldsToUpdate.slice(i, i + BATCH_SIZE);
        const entities = await entityModel.find({ email: { $in: fieldsToUpdate.map(data=>data?.email) } }).limit(BATCH_SIZE);
        console.log(entities,  bulkDataBatch.map(data=>data?.email));
        bulkEmailContactMap = new Map();
        for (const entity of entities) {
            bulkEmailContactMap.set(entity.email, entity);
        }
        await processBulkData(bulkDataBatch, bulkEmailContactMap);
    }

    bulkAction.status = 'completed';
    bulkAction.successCount = successCount;
    bulkAction.failureCount = failureCount;
    bulkAction.skippedCount = skippedCount;
    await bulkAction.save();

    logger.info(`Bulk action ID ${bulkActionId} completed. Success: ${bulkAction.successCount}, Failures: ${bulkAction.failureCount}, Skipped: ${bulkAction.skippedCount}`);
    return results;
};

const getEntity = (entity) => {
    let entityModel;
    switch (entity) {
        case 'contact':
            entityModel = require('../models/Contact');
            break;
        case 'company':
            entityModel = require('../models/Company');
            break;
        default:
            throw new Error(`Unsupported entity type: ${entity}`);
    }
    return entityModel;
};
