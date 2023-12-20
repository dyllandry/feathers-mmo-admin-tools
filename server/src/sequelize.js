const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (app) {
  const dialect = app.get('database').dialect;
  const username = app.get('database').username;
  const password = app.get('database').password;
  const host = app.get('database').host;
  const port = app.get('database').port;
  const name = app.get('database').name;
  const connectionString = `${dialect}://${username}:${password}@${host}:${port}/${name}`;

  const sequelize = new Sequelize(connectionString, {
    dialect,
    logging: console.log,
    define: {
      freezeTableName: true
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function (...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    app.set('sequelizeSync', sequelize.sync());

    return result;
  };
};
