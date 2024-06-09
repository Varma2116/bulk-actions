# Bulk Action Platform for CRM Application

## Overview

This project is a bulk action platform capable of performing various bulk actions on CRM entities.
It is highly scalable, efficient, and flexible, designed to handle large volumes of data with robust error handling.

## Core Features

- **CRM Entities**: Supports bulk actions on Contacts, Log, BulkAction.
- **Bulk Update**: Allows updating multiple fields for an entity.
- **Batch Processing**: Processes updates in batches for efficiency.
- **Logging and Statistics**: Detailed logs and statistics for each bulk action.
- **Extensibility**: Modular design to easily add new bulk actions.

### Prerequisites
- Node.js
- MongoDB
- RabbitMQ

### Stat Mongo for ubuntu
    sudo systemctl start mongod
    sudo systemctl status mongod


### Rabit Installation for Ubuntu
- sudo apt-get update
- sudo apt-get install rabbitmq-server
- sudo service rabbitmq-server start
- sudo service rabbitmq-server status

## Monitoring RabbitMQ

1. **Access RabbitMQ Management UI:**

    Open your web browser and navigate to: [http://localhost:15672](http://localhost:15672)

2. **Login with the default credentials:**

    - Username: `guest`
    - Password: `guest`

## Logging

All logs are saved to `app.log` and also output to the console. You can view logs to monitor the processing of bulk actions, including successes, failures, and skipped records.


### API Endpoints

Status Check Endpoint
    GET /ping - To check Service is up or not

Bulk Action List Endpoint
    GET /bulk-actions - Lists all the bulk actions.


Bulk Action Creation Endpoint
    POST /bulk-actions - Creates a new bulk action.

Bulk Action Status Endpoint
    GET /bulk-actions/:actionId - Retrieves the details about the bulk action.

Bulk Action Stats Endpoint
    GET /bulk-actions/:actionId/stats - Retrieves a summary of the bulk action, including success, failure, and skipped counts.



### Start the application: 
    node app.js