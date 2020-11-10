/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package  CrewNode
 * @author   Reece Benson <business@reecebenson.me>
 * @since    v0.0.1-alpha.3
 */
const Sequelize = require('sequelize');

module.exports = (db) => ({
  info: {
    name: "GamePlayer"
  },
  exec: () =>
    db.define('game_player', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      gameId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      playerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      playerColor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      playerSkin: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      playerHat: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      playerPet: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      playerPosX: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      playerPosY: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discordUid: {
        type: Sequelize.STRING,
        allowNull: true
      }
    }, { timestamps: false })
});