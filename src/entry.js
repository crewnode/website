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
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

// Setup Express
const server = http.createServer(app);

// Enable CORS & Cookies
app.use(cors());
app.use(cookieParser());

// Disable cache on dev
if (process.env.ENVIRONMENT === 'dev') {
  app.set('etag', false);
}

// Engine for static files
const twig = require('twig');
app.set("twig options", {
  allow_async: true,
  strict_variables: false,
});

// Static files
app.use(express.static(__dirname + '/static'));

// JSON Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Authentication Setup
const JwtStrategy = require('passport-jwt').Strategy;
let opts = {
  jwtFromRequest: function(req) {
    let token = null;
    if (req && req.cookies && req.cookies['jwt']) {
      token = req.cookies['jwt'];
    }
    return token;
  },
  secretOrKey: process.env.WEB_SECRETKEY ?? "mySecretKey"
};
app.use(passport.initialize());
passport.use(new JwtStrategy(opts, (payload, done) => {
  // TODO: Return payload
  // TODO: Validate user exists
  // TODO: Validate session hasn't expired
  // TODO: Refresh token with Discord to get updates (if expired)
  done(null, payload.data.user);
}));

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
  return res.status(404).render(__dirname + '/static/error.twig', {
    errorMessage: "page not found",
  });
});

// Listener setup
server.listen(process.env.WEB_PORT, '0.0.0.0', (err) => {
  console.log(`[SRV]: Listening on 0.0.0.0:${process.env.WEB_PORT}`);
});