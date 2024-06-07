const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./src/routes');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');
const { connectRabbitMQ } = require('./src/utils/rabbitmq');
const { consumeMessages } = require('./src/services/bulkActionService');
const loggerMiddleware = require('./src/middlewares/loggerMiddleware');
const cronScheduler = require('./src/services/Scheduler')


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

cronScheduler();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.json());
app.use(loggerMiddleware);

// Placeholder for routes
app.use('/', routes);

// Handle 404 errors
app.use(notFoundHandler);

// General error handler
app.use(errorHandler);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    (async () => {
        await connectRabbitMQ();
        consumeMessages();
    })();
});