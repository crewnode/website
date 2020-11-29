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
   * @route   /api/get/loader
   * @desc    Get the launcher details
   * @request GET
   * @access  Public
   * @limit   1 every second
   */
  app.all('/api/get/loader', /*rateLimit({ windowMs: (1 * 60) * 1000, max: 60 }), */async (req, res) => {
    console.log("yes");
    return res.json({
      appId: "CrewNodeLauncher",
      fileName: "CrewNode.Launcher.exe",
      version: "1.0.0.1",
      versionUrl: "https://crewno.de/downloads/latest",
      shaHash: "d4d52ce7e358637c353b53081f14627f89d71650caf62873fac8803f2da55f6c047fb20b9b140573de0f2a50e7cab4ad3d7b9f20ac96834b3b0905ead5c4ef9a",
      launchArgs: ""
    });
  });

  /**
   * ---------------------------------------------------
   * @route   /downloads/latest
   * @desc    Get a download to the launcher
   * @request GET
   * @access  Public
   * @limit   3 every 15 minutes
   */
  app.get('/downloads/latest', rateLimit({ windowMs: (15 * 60) * 1000, max: 3 }), async (req, res) => {
    return res.sendFile(path.join(__dirname, "../downloads", "CrewNode.Launcher.exe"));
  });

};