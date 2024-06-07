const rateLimit = {};

const rateLimiter = (req, res, next) => {
    const accountId = req.body.accountId;
    if (!rateLimit[accountId]) {
        rateLimit[accountId] = { count: 0, timestamp: Date.now() };
    }

    const currentTime = Date.now();
    if (currentTime - rateLimit[accountId].timestamp < 60000) {
        if (rateLimit[accountId].count >= 10000) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
        rateLimit[accountId].count++;
    } else {
        rateLimit[accountId].count = 1;
        rateLimit[accountId].timestamp = currentTime;
    }
    next();
};

module.exports = rateLimiter;
