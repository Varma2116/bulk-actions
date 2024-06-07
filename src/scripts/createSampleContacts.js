const mongoose = require('mongoose');
const Contact = require('../models/Contact');

// MongoDB connection URL
const mongoURI = "mongodb://localhost:27017/bulk-action-platform";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');

        // Sample contacts data
        const sampleContacts = [
            { name: 'John Doe', email: 'john.doe@example.com', age: 30, status: "active" },
            { name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, status: "active" },
            { name: 'Bob Johnson', email: 'bob.johnson@example.com', age: 40, status: "active" },
            { name: 'Alice', email: 'alice.williams1@example.com', age: 45, status: "active" },
            { name: 'Williams', email: 'alice.williams2@example.com', age: 25, status: "active" },
            { name: 'Alice1', email: 'alice.williams3@example.com', age: 36, status: "active" },
        ];

        // Insert sample contacts into the database
        Contact.insertMany(sampleContacts)
            .then((contacts) => {
                console.log(`${contacts.length} contacts inserted successfully`);
                // Close the MongoDB connection
                mongoose.connection.close();
            })
            .catch((err) => {
                console.error('Error inserting contacts:', err);
                // Close the MongoDB connection
                mongoose.connection.close();
            });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
