# Node.js Backend Template

A clean, reusable Node.js backend template with MongoDB and Redis integration.

## Overview

This template provides a solid foundation for building Node.js backend applications. It includes essential components like database connections, authentication, logging, and a structured API framework.

## Features

- RESTful API structure with versioning
- MongoDB integration with Mongoose
- Redis for caching and session management
- JWT authentication
- Socket.io for real-time communication
- Structured logging with Winston
- Middleware for authentication and request processing
- Clean project organization

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB
- Redis

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nodejs-backend-template.git
   cd nodejs-backend-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - The application uses the `config` package for configuration management
   - Create or modify the `config/default.json` file with your environment-specific settings:
   ```json
   {
     "redis": {
       "connections": {
         "master": {
           "host": "localhost",
           "port": 6379,
           "database": 0,
           "password": "your_redis_password"
         }
       }
     },
     "mongo": {
       "connections": {
         "master": {
           "host": "localhost",
           "port": 27017,
           "database": "app-db",
           "options": {
             "useUnifiedTopology": true,
             "useNewUrlParser": true,
             "user": "your_mongo_user",
             "pass": "your_mongo_password"
           }
         }
       }
     },
     "port": 3000,
     "logLevel": "info",
     "secretKey": "your_secret_key_for_jwt",
     "serviceName": "NODE-BACKEND-TEMPLATE"
   }
   ```
   - For production, you can create a `config/production.json` file with production-specific settings

## Project Structure

```
nodejs-backend-template/
├── index.js                  # Main application entry point
├── lib/                      # Core library files
│   ├── connections/          # Database connections (MongoDB, Redis)
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── logger/               # Logging utilities
│   ├── util/                 # Utility functions
│   ├── const.js              # Constants
│   └── message.js            # Response messages
├── public/                   # Static files
├── config/                   # Configuration files
└── logs/                     # Application logs
```

## Usage

Start the development server with hot reloading:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

The server will be running at http://localhost:3000 (or the port specified in your configuration).

## API Structure

API endpoints follow this structure:
```
/api/{version}/{route}
```

Example endpoints:
- `/api/v1.0/auth/login` - User login
- `/api/v1.0/auth/register` - User registration
- `/api/v1.0/user/profile` - Get user profile
- `/api/v1.0/user/update` - Update user information

## License

This project is licensed under the MIT License - see the package.json file for details.
