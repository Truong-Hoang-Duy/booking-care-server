import dotenv from "dotenv";
dotenv.config();

module.exports = {
  development: {
    username: "root",
    password: "root",
    database: "booking_care",
    host: "localhost",
    dialect: "mysql",
    port: "8889",
    logging: false,
    query: {
      raw: true,
    },
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
};
