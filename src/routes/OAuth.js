/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.1
 */
const Sequelize = require('sequelize');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const axios = require('axios');
const querystring = require('querystring');
const env = process.env;
const jwt = require('jsonwebtoken')
const DiscordOAuth2 = require('discord-oauth2');
const crypto = require('crypto');
const cnOAuth = require('../controllers/OAuth');
const { v4: uuidv4 } = require('uuid');
const oauth = new DiscordOAuth2({
  clientId: env.OAUTH_DISCORD_CLIENT_ID,
  clientSecret: env.OAUTH_DISCORD_CLIENT_SECRET,
  requestUri: 'https://crewnode.net/api/discord'
});

module.exports = (app, models) => {
  const redirectUri = 'https://crewnode.net/api/discord';

  /**
   * ---------------------------------------------------
   * @route   /api/auth
   * @desc    Redirect the user to Discord OAuth
   * @request GET
   * @access  Public
   * @limit   10 every 15 minutes
   */
  app.get('/api/auth/:challenge', rateLimit({ windowMs: (15 * 60) * 1000, max: 10 }), async (req, res) => {
    if (!req.params.challenge) return res.status(403).json({ error: 'INVALID_CHALLENGE' });

    // Generate a state to use on return, used to identify the launcher and user
    let state = (crypto.createHash('sha256').update((req.params.challenge === 'web' ? uuidv4() : req.params.challenge + "cn")).digest('base64')).replace(/\W/g, '');
    if (req.params.challenge === 'web') {
      state += '_web';
    }

    await models.UserKey.create({
      uid: null,
      key: state
    });

    // Redirect to Discord OAuth
    return res.status(200).redirect(oauth.generateAuthUrl({
      scope: ['identify', 'guilds', 'guilds.join', 'email'],
      state: state
    }));
  });

  /**
   * ---------------------------------------------------
   * @route   /api/discord
   * @desc    Read the Discord OAuth information for this users session
   * @request POST
   * @access  Public
   * @limit   N/A
   */
  app.all('/api/discord', async (req, res) => {
    if (!req.query.code) return res.status(403).json({ error: 'INVALID_CODE' });
    if (!req.query.state) return res.status(400).json({ error: 'INVALID_STATE' });

    // Get token
    oauth.tokenRequest({
      code: req.query.code,
      grantType: 'authorization_code',
      redirectUri: redirectUri
    })
      .then((r) => res.redirect(`/api/auth/${r.access_token}/${r.refresh_token}/${req.query.state}`))
      .catch((err) => res.status(400).json(err.response.data));
  });

  /**
   * ---------------------------------------------------
   * @route   /api/auth/{{ access_token }}
   * @desc    Create or login a user with their Discord access token
   * @request GET
   * @access  Public
   * @limit   N/A
   */
  app.get('/api/auth/:accessToken/:refreshToken/:userKey', async (req, res) => {
    if (
      !req.params.accessToken || !req.params.refreshToken || !req.params.userKey ||
      req.params.accessToken.length != 30 || req.params.refreshToken.length != 30
    ) return res.status(400).json({ error: 'INVALID_REQUEST' });

    const userKey = req.params.userKey;
    const userData = await oauth.getUser(req.params.accessToken);
    const guildData = await oauth.getUserGuilds(req.params.accessToken);

    // Check if user is valid
    let auth = new cnOAuth(app, models, userData, guildData, {...req.params, clientIp: req.clientIp});
    let userExists = false;
    if (await auth.doesUserExist()) {
      // Attempt to log this user in
      userExists = true;
    }
    else {
      // Register a new user
      if (await auth.createUser()) {
        userExists = true;
      }
    }

    // Set our JWT cookie if our user exists
    if (userExists) {
      res.cookie('jwt', await auth.getJwt());

      // Claim the state token
      if (auth.dbUser.id) {
        await models.UserKey.update({ uid: auth.dbUser.id }, { where: { key: userKey } });
      }
      
      return userKey.endsWith('_web')
            ? res.status(200).redirect('/dashboard')
            : res.status(200).redirect('/launcher/login/success');
    }

    return res.json(
      userExists
        ? { user: 'USER_EXISTS' }
        : { user: 'NO_EXIST' }
    );
  });

  /**
   * ---------------------------------------------------
   * @route   /api/status/{{ launcherClient }}
   * @desc    Create or login a user with their Discord access token
   * @request GET
   * @access  Public
   * @limit   N/A
   */
  app.get('/api/status/:userKey', async (req, res) => {
    if (!req.params.userKey) return res.status(400).json({ error: 'INVALID_CODE' });

    // Check if the userKey matches
    let key = (crypto.createHash('sha256').update(req.params.userKey + "cn").digest('base64')).replace(/\W/g, '');
    let auth = new cnOAuth(app, models);
    let user = await auth.loadUser(key);
    if (!auth.dbUser) return res.status(404).json({ error: 'INVALID_USER' });
    if (req.clientIp != user.cn.ipAddress) return res.status(403).json({ error: 'REAUTHENTICATE' });
    return res.json(user);
  });

};
