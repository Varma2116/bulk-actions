const express = require('express');
const router = express.Router();
const bulkActionRouter = require('./bulkActions-route');
const healthCheckRouter = require('./healthCheck-route');

router.use('/bulk-actions', bulkActionRouter);
router.use('/ping', healthCheckRouter)


module.exports = router;
