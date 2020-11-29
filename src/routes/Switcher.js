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
const { v4: uuidv4 } = require('uuid');

module.exports = (app, models) => {

  /**
   * ---------------------------------------------------
   * @route   /app/authorize
   * @desc    Authorise an application
   * @request GET
   * @access  Public
   * @limit   1 every minute
   */
  app.all('/app/authorize', rateLimit({ windowMs: (1 * 60) * 1000, max: 5 }), async (req, res) => {
    // Check token
    const token = req.headers['authorization'];
    if (!token.includes('CrewNode ')) {
      console.log('token:', token);
      return res.send('ACCESS_DENIED');
    }

    // Check Bearer
    const bearer = token.replace('CrewNode ', '');
    console.log('bearer: "' + bearer + '"');
    await models.ListingManager.findOne({
      where: { apiKey: bearer }
    })
      .then(async (manager) => {
        console.log(manager);
        // Create new session
        try {
          const session = await models.ListingSession.create({
            listingId: manager.listingId,
            sessionId: uuidv4(),
            managerId: manager.id
          });
          console.log('created session:', session);

          return res.json({
            sessionId: session.sessionId,
          });
        } catch (e) {
          console.error(e);
        }
      })
      .catch((e) => {
        return res.send('ACCESS_DENIED');
      });
  });

};