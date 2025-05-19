const express = require('express');
const cors = require('cors');

// Global variables
global._ = require('lodash');
global.config = require('config');
global.Logger = require('./lib/logger');
global.mongoose = require('mongoose');
global.fs = require('fs');
global.moment = require('moment');
global.async = require('async');
global.ms = require('ms');
global.MailUtil = require('./lib/util/mail');
global.logger = Logger(`${__dirname}/logs`);

// Load models
fs.readdirSync(`${__dirname}/lib/models`).forEach((file) => {
  global[_.upperFirst(_.camelCase(file.replace('.js', 'Model')))] = require(`./lib/models/${file}`);
});

// Middleware
const bodyParser = require('body-parser');
const tokenToUserMiddleware = require('./lib/middleware/tokenToUser');
const verifyTokenMiddleware = require('./lib/middleware/verifyToken');

// Handle routes
const ApiRoutes = require('./lib/routes/api');

// Start server
const app = express();
app.set('trust proxy', true);
const server = require('http').Server(app);
global.io = require('socket.io')(server);

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Define route declaration function
const declareRoute = (method, routeName, middlewares = [], destinationRoute) => {
  if (!destinationRoute || !routeName) {
    return;
  }

  Object.keys(destinationRoute).forEach((version) => {
    app[method](`/api/${version}${routeName}`, middlewares, destinationRoute[version]);
  });
};

// API Routes - Example routes for the template
declareRoute('post', '/auth/login', [], ApiRoutes.auth.login);
declareRoute('post', '/auth/register', [], ApiRoutes.auth.register);
declareRoute('post', '/user/profile', [tokenToUserMiddleware], ApiRoutes.user.profile);
declareRoute('post', '/user/update', [tokenToUserMiddleware], ApiRoutes.user.update);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const port = _.get(config, 'port', 3000);
server.listen(port, () => {
  logger.logInfo('Server listening at port:', port);
});

process.on('uncaughtException', (err) => {
  logger.logError('uncaughtException', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
