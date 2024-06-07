const express = require('express');
const multer = require('multer');
const router = express.Router();
const bulkActionController = require('../controllers/bulkActionController');
const rateLimiter = require('../middlewares/rateLimit');
const { readCSV } = require('../utils/readCsv');

const upload = multer({ dest: 'uploads/' });
const logger = require('../config/logger');

router.get('/', bulkActionController.listBulkActions);

router.post('/', rateLimiter, upload.single('file'), async (req, res) => {
    try {  
        // Check if file is uploaded
      if (!req.file) {
          return res.status(400).json({ error: "CSV file is required" });
      }
  
      const filePath = req.file.path;
      const updateData = await readCSV(filePath);
      const entityVal = req.body.entity;
      return bulkActionController.createBulkAction(updateData, entityVal, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

router.get('/:actionId', bulkActionController.getBulkAction);

router.get('/:actionId/stats', bulkActionController.getBulkActionStats);

router.post('/schedule', rateLimiter, upload.single('file'), async (req, res) => {
  try {  
      // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ error: "CSV file is required" });
    }

    const filePath = req.file.path;
    const updateData = await readCSV(filePath);
    const entityVal = req.body.entity;
    const scheduledAt = req.body.scheduledAt;
    return bulkActionController.scheduleBulkAction(updateData, entityVal, scheduledAt, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;