import { Sequelize } from "sequelize";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/truyen_db";

declare global {
  // eslint-disable-next-line no-var
  var __truyenSequelize: Sequelize | undefined;
}

export const sequelize =
  global.__truyenSequelize ||
  new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: process.env.SEQUELIZE_LOG === "true" ? console.log : false,
    pool: {
      max: 8,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.__truyenSequelize = sequelize;
}
