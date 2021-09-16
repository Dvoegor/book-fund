const Sequelize = require("sequelize");
require("dotenv").config({ path: '.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_NAME,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
      timestamps: false,
    },
  }
);

module.exports = sequelize;
