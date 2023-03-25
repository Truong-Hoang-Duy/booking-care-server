const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("booking_care", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: "8889",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connectDB;
