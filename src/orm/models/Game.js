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
    name: "Game"
  },
  exec: () =>
    db.define('game', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      creator: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gameCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gameMode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gameState: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, { timestamps: true })
});