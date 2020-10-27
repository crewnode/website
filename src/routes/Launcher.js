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
   * @route   /launcher/login
   * @request GET
   * @access  Public
   * @limit   N/A
   * @static
   */
  app.get('/launcher/login', async (req, res) => {
    if (req.user) {
      return res.redirect('/launcher/dashboard');
    }

    return res.render('/crewnode/static/login.launcher.twig');
  });

  /**
   * ---------------------------------------------------
   * @route   /launcher/keys
   * @request GET
   * @access  Public
   * @limit   N/A
   * @static
   */
  app.get('/launcher/keys', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Get the user key
    if (req.user) {
      return res.render('/crewnode/static/key.launcher.twig', {
        apiKey: 'testytest',
      });
    }

    return res.status(403).render('/crewnode/static/error.twig', {
      errorMessage: 'not authorised',
    });
  });

};