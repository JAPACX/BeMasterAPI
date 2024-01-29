import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";

export const createDatabase = async (sequelize: Sequelize) => {
  try {
    const sqlScriptPath = path.join(__dirname, "./scripts/script.sql");
    const sqlScript = fs.readFileSync(sqlScriptPath, "utf-8");

    await sequelize.query(sqlScript, { raw: true });

    // eslint-disable-next-line no-console
    console.log("Create tables successful.");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error during database initialization:", error);
  }
};
