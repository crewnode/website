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
  app.get('/api/launcher/version', async (req, res) => {
    return res.send('0.0.1-alpha.2');
  });

  /**
   * ---------------------------------------------------
   * @route   /launcher/login/success
   * @request GET
   * @access  Public
   * @limit   N/A
   * @static
   */
  app.get('/launcher/login/success', async (req, res) => {
    return res.render('/crewnode/static/launcher/success.twig');
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
      return res.render('/crewnode/static/launcher/key.twig', {
        apiKey: 'testytest',
      });
    }

    return res.status(403).render('/crewnode/static/error.twig', {
      errorMessage: 'not authorised',
    });
  });

};