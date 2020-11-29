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
    name: "Listing"
  },
  exec: () =>
    db.define('listing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "A new listing!"
      },
      players: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      maxPlayers: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 20
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "new"
      },
      serverIp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      serverPort: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 22023
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
    }, { timestamps: true })
});
