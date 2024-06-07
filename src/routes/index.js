const express = require('express');
const router = express.Router();
const bulkActionRouter = require('./bulkActions');
const healthCheckRouter = require('./healthCheck');

router.use('/bulk-actions', bulkActionRouter);
router.use('/ping', healthCheckRouter)


module.exports = router;
