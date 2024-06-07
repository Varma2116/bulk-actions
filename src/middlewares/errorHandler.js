const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
};

const notFoundHandler = (req, res, next) => {
    res.status(404);
    res.json({
        error: {
            message: 'API endpoint not found',
        },
    });
};

module.exports = { errorHandler, notFoundHandler };
