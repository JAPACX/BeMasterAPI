import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

export const pool = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
