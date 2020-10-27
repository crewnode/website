/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.1
 */
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = class OAuth {
  // TODO:
  // Implement JWT -> https://medium.com/@rustyonrampage/using-oauth-2-0-along-with-jwt-in-node-express-9e0063d911ed
  constructor(app, models) {
    this.app = app;
    this.models = models;
  }

  doesUserExist = async (user, guilds, keys) => {
    return await this.validateUser(user) ? true : await this.createUser(user, guilds, keys);
  };

  validateUser = async (user) => {
    const authExists = await this.models.UserDiscord.findOne({
      where: {
        discordId: user.id,
        email: user.email,
      }
    });
    if (!authExists) return false;

    // Update auth with updated information
    console.log(`Updating ${user.username} (${user.id})`);
    await this.models.UserDiscord.update(
      {
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        locale: user.locale
      },
      {
        where: { discordId: user.id, email: user.email }
      });

    return true;
  };

  createUser = async (user, guilds, keys) => {
    console.log('create user');

    // Check if the user is in the CrewNode Guild
    const guildId = "765864036440342558";
    const crewNodeGuild = guilds.filter((v, i) => v.id === guildId);
    const inGuild = crewNodeGuild.length > 0;

    // Create the user
    const newUser = await this.models.User.create({
      email: user.email,
      username: user.username,
      password: '', // TODO: What do we do here?
      emailConfirmed: user.verified,
      emailToken: '', // TODO: Generate UUIDv4 Token
      ipAddress: '', // TODO: Get User IP
      sessionHash: '', // TODO: Generate Session Hash
      provider: 'discord',
    });
    const discordUser = await this.models.UserDiscord.create({
      uid: newUser.id,
      discordId: user.id,
      username: user.username,
      discriminator: user.discriminator,
      email: user.email,
      verifiedEmail: user.verified,
      avatar: user.avatar,
      inGuild: inGuild,
      locale: user.locale,
      accessToken: keys.accessToken,
      refreshToken: keys.refreshToken
    });
    
    return true;
  };

};
