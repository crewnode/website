const Sequelize = require('sequelize');

module.exports = (db) => ({
  info: {
    name: "ListingSession"
  },
  exec: () =>
    db.define('listing_session', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      listingId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      managerId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, { timestamps: true })
});
