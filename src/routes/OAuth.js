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
const DiscordOAuth2 = require('discord-oauth2');
const crypto = require('crypto');
const oauth = new DiscordOAuth2({
  clientId: env.OAUTH_DISCORD_CLIENT_ID,
  clientSecret: env.OAUTH_DISCORD_CLIENT_SECRET,
  requestUri: 'https://crewnode.net/api/discord'
});

module.exports = (app, models) => {
  const authorizeUrl = 'https://discord.com/oauth2/authorize';
  const tokenUrl = 'https://discord.com/api/oauth2/token';
  const clientId = env.OAUTH_DISCORD_CLIENT_ID;
  const clientSecret = env.OAUTH_DISCORD_CLIENT_SECRET;
  const redirectUri = 'https://crewnode.net/api/discord';

  /**
   * ---------------------------------------------------
   * @route   /api/auth
   * @desc    Redirect the user to Discord OAuth
   * @request GET
   * @access  Public
   * @limit   10 every 15 minutes
   */
  app.get('/api/auth', rateLimit({ windowMs: (15 * 60) * 1000, max: 10 }), async (req, res) => {
    return res.status(200).redirect(oauth.generateAuthUrl({
      scope: ['identify', 'guilds', 'guilds.join', 'email'],
      state: crypto.randomBytes(16).toString('hex')
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

    // Get token
    const code = req.query.code;
    oauth.tokenRequest({
      code: code,
      grantType: 'authorization_code',
      redirectUri: redirectUri
    })
      .then((r) => res.redirect(`/api/auth/${r.access_token}/${r.refresh_token}`))
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
  app.get('/api/auth/:accessToken/:refreshToken', async (req, res) => {
    if (
      !req.params.accessToken ||
      !req.params.refreshToken ||
      req.params.accessToken.length != 30 ||
      req.params.refreshToken.length != 30
    ) return res.status(400).json({ error: 'INVALID_REQUEST' });
    return oauth.getUser(req.params.accessToken).then((d) => {
      return res.json(d);
    });
  });

};