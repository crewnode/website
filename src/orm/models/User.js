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
    name: "User"
  },
  exec: () =>
    db.define('user', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      emailConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      emailToken: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sessionHash: {
        type: Sequelize.TEXT
      }
    }, { timestamps: true })
});