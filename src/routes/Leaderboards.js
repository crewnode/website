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

module.exports = (app, models) => {

  /**
   * ---------------------------------------------------
   * @route   /api/leaderboards/top
   * @desc    Get the version of the launcher
   * @request GET
   * @access  Public
   * @limit   100 every 15 minutes
   */
  app.get('/api/leaderboards/top', rateLimit({ windowMs: (15 * 60) * 1000, max: 100 }), async (req, res) => {
    return res.json({
      // TODO: Get from database
      top: [
        {
          name: "Simple",
          won: "4397284382",
          hours: "13"
        }
      ]
    });
  });

};