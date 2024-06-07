// middleware/logger.js

const { format } = require('winston');
const { combine, timestamp, printf } = format;
const logger = require('../config/logger');

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Log the incoming request
  logger.info(`${req.method} ${req.url}`);

  // Pass the request to the next middleware
  next();

  // Calculate and log the time taken to return the response
  const end = Date.now();
  const duration = end - start;
  logger.info(`Request served in ${duration}ms`);
};

module.exports = loggerMiddleware;
