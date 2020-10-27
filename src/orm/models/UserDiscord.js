/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.1
 */
const Sequelize = require('sequelize');

module.exports = (db) => ({
  info: {
    name: "UserDiscord"
  },
  exec: () =>
    db.define('user_discord', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discordId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discriminator: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verifiedEmail: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      inGuild: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      locale: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "en-GB"
      },
      accessToken: {
        type: Sequelize.STRING,
      },
      refreshToken: {
        type: Sequelize.STRING
      }
    }, { timestamps: true })
});
