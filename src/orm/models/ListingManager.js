const Sequelize = require('sequelize');

module.exports = (db) => ({
  info: {
    name: "ListingManager"
  },
  exec: () =>
    db.define('listing_manager', {
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
      }
    }, { timestamps: true })
});
