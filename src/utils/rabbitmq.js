const amqp = require('amqplib');
const { QUEUE_NAME } = require('./Constants')
let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
    } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
    }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
