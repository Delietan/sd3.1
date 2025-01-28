const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require('dotenv').config();

const connection = {
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT, // Ensure this is the DB port (not your app port)
  dialect: process.env.DIALECT, // Example: 'postgres' or 'mysql'
  dialectModule: process.env.DIALECTMODEL ? require(process.env.DIALECTMODEL) : undefined, // Require the module directly
};

const sequelize = new Sequelize(connection.database, connection.username, connection.password, {
  host: connection.host,
  port: connection.port,
  dialect: connection.dialect,
  dialectModule: connection.dialectModule, // Pass the required module
});

const db = {};
db.sequelize = sequelize;

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
