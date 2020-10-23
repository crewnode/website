/**
 * ---------------------------------------------------
 * CrewNode
 * ---------------------------------------------------
 * @package CrewNode
 * @author  Reece Benson <business@reecebenson.me>
 * @since   v0.0.1-alpha.1
 */
const SQLize = require('sequelize');
const fs = require('fs');
const util = require('util');
const env = process.env;

// Connect to the database
const db = new SQLize(env.POSTGRES_DATABASE, env.POSTGRES_USER, env.POSTGRES_PASSWORD, {
  host: 'db',
  dialect: 'postgres',
  logging: false
});

// Read our custom models
let models = {};
const readModels = async (callback) => {
  const modelPath = require('path').join(__dirname, 'models');
  const readdir = util.promisify(fs.readdir);

  // Iterate through each directory inside of models
  // (including itself)
  await readdir(modelPath)
    .then((dir) => {
      dir.forEach((f) => {
        // Check its a JS file
        if (f.slice(-2) === 'js') {
          let model = require(`${modelPath}/${f}`)(db);
          if (!model.info) return;
          models[model.info.name] = model.exec();
          console.log(`[SRV]: Loaded database model: ${model.info.name}`);
        }
      });
    })
    .catch(e => console.warn('Model Reading', e));

  // Finalise with our callback
  callback();
};

// Initialise the database connection
// and read our models for usage
db
  .authenticate()
  .then(() => readModels(() => db.sync()))
  .catch((e) => console.warn('DB Authentication', e));

// Export our db connection & models for global namespace use
module.exports = { db, models };
