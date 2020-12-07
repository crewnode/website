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
   * @route   /home
   * @desc    The homepage
   * @request GET
   * @access  Public
   */
  app.get('/home', async (req, res) => {
    return res.render('/crewnode/static/site/index.twig');
  });

  /**
   * ---------------------------------------------------
   * @route   /login
   * @desc    Login page
   * @request GET
   * @access  Public
   */
  app.get('/login', async (req, res) => {
    return res.render('/crewnode/static/site/login.twig');
  });

  /**
   * ---------------------------------------------------
   * @route   /dashboard
   * @desc    Dashboard
   * @request GET
   * @access  Public
   */
  app.get('/dashboard', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Get the user key
    if (req.user) {
      return res.render('/crewnode/static/site/dashboard.twig', {
        user: req.user,
      });
    }

    return res.status(403).render('/crewnode/static/error.twig', {
      errorMessage: 'not authorised',
    });
  });

  /**
   * ---------------------------------------------------
   * @route   /servers
   * @desc    Get a list of servers
   * @request GET
   * @access  Public
   */
  app.get('/servers', async (req, res) => {
    return res.send('0.0.1-alpha.2');
  });

};