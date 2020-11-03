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
  constructor(app, models, user = null, guilds = null, keys = null) {
    this.app = app;
    this.models = models;
    this.user = user;
    this.guilds = guilds;
    this.keys = keys;
    this.dbUser = null;
  }

  doesUserExist = async () => {
    return await this.validateUser() ?? false;
  };

  getJwt = async () => {
    return jwt.sign({
      data: {
        discord: this.user,
        user: await this.getUser(),
      },
      tokens: this.keys
    }, process.env.WEB_SECRETKEY ?? "mySecretKey", { expiresIn: '24h' });
  };

  loadUser = async (userKey) => {
    let key = await this.models.UserKey.findOne({
      where: {
        key: userKey
      }
    });
    
    if (key && key.uid != null) {
      let cacheUser;
      this.dbUser = {
        discord: (cacheUser = await this.models.UserDiscord.findOne({
          where: {
            id: key.uid
          },
          limit: 1,
          order: [['createdAt', 'DESC']]
        })),
        cn: await this.models.User.findOne({
          where: {
            id: cacheUser.uid
          },
          limit: 1
        })
      };
      return this.dbUser;
    }

    return false;
  }

  getUser = async () => {
    return await this.models.User.findOne({
      where: {
        id: this.dbUser.uid,
      }
    });
  };

  validateUser = async () => {
    // The user exists, so we should update them with up-to-date information
    const userAuth = await this.models.UserDiscord.findOne({
      where: {
        discordId: this.user.id,
        email: this.user.email,
      }
    });
    if (!userAuth) return null;
    this.dbUser = userAuth;

    // Update our user data
    await this.models.User.update(
      {
        ipAddress: this.keys.clientIp
      },
      {
        where: { id: userAuth.uid }
      });
    await this.models.UserDiscord.update(
      {
        username: this.user.username,
        discriminator: this.user.discriminator,
        avatar: this.user.avatar,
        locale: this.user.locale
      },
      {
        where: { discordId: this.user.id, email: this.user.email }
      });

    // Return TRUE for update
    console.log(`Updating ${this.user.username} (${this.user.id})`);
    return true;
  };

  createUser = async () => {
    // Check if the user is in the CrewNode Guild
    const guildId = "765864036440342558"; // process.env.DISCORD_GUILD_ID
    const crewNodeGuild = this.guilds.filter((v, i) => v.id === guildId);
    const inGuild = crewNodeGuild.length > 0;

    // If they're not in the guild, join it!
    if (!inGuild) {
      console.log('user not in guild, joining...');
    }

    // Create the user
    const newUser = await this.models.User.create({
      email: this.user.email,
      username: this.user.username,
      password: '', // TODO: What do we do here?
      emailConfirmed: this.user.verified,
      emailToken: '', // TODO: Generate UUIDv4 Token
      ipAddress: this.keys.clientIp,
      sessionHash: '', // TODO: Generate Session Hash
      provider: 'discord',
    });
    const discordUser = await this.models.UserDiscord.create({
      uid: newUser.id,
      discordId: this.user.id,
      username: this.user.username,
      discriminator: this.user.discriminator,
      email: this.user.email,
      verifiedEmail: this.user.verified,
      avatar: this.user.avatar,
      inGuild: inGuild,
      locale: this.user.locale,
      accessToken: this.keys.accessToken,
      refreshToken: this.keys.refreshToken
    });
    
    // Return TRUE for success
    return true;
  };

};
