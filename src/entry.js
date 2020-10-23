/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.1
 */
const http = require('http');
const cors = require('cors');
const { db, models } = require('./orm');
const express = require('express');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const app = express();

// Setup Express
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Static files
app.use(express.static(__dirname + '/static'));

// JSON Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Setup routes
const routePath = require('path').join(__dirname, 'routes');
require('fs')
  .readdirSync(routePath)
  .forEach((f) => {
    if (f.slice(-2) === 'js') {
      console.log(`[SRV]: Loaded route handler: ${f}`);
      require(`${routePath}/${f}`)(app, models);
    }
  });

// Error handling
app.all('*', (req, res) => {
  return res.status(404).sendFile(__dirname + '/static/error.html');
});

// Listener setup
server.listen(process.env.WEB_PORT, '0.0.0.0', (err) => {
  console.log(`[SRV]: Listening on 0.0.0.0:${process.env.WEB_PORT}`);
});