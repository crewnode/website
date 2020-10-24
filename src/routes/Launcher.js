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
   * @route   /api/launcher/version
   * @desc    Get the version of the launcher
   * @request GET
   * @access  Public
   * @limit   10 every 15 minutes
   */
  app.get('/api/launcher/version', rateLimit({ windowMs: (15 * 60) * 1000, max: 10 }), async (req, res) => {
    return res.json({
      // TODO: Get from database
      version: "0.0.0-alpha.1"
    });
  });

  /**
   * ---------------------------------------------------
   * @route   /login
   * @request GET
   * @access  Public
   * @limit   N/A
   * @static
   */
  app.get('/launcher/login', async (req, res) => {
    return res.sendFile("/crewnode/static/login.launcher.html");
  });

};