import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Database setup (using Sequelize as an example)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);


// Test DB connection and sync model
(async () => {
  try {
    await sequelize.authenticate();
    console.log("##### Connected to PostgreSQL database #####");
    await sequelize.sync();
  } catch (err) {
    console.error("------ Database connection failed ----------", err);
  }
})();

//server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});