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
const passport = require('passport');
const path = require('path');

module.exports = (app, models) => {

  /**
   * ---------------------------------------------------
   * @route   /app/authorize
   * @desc    Authorise an application
   * @request GET
   * @access  Public
   * @limit   1 every minute
   */
  app.all('/app/authorize', /*rateLimit({ windowMs: (1 * 60) * 1000, max: 1 }), */async (req, res) => {
    // TODO: Implement
    return res.json({
      sessionId: 'helloWorLd',
    });
  });

};