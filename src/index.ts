import express, { Express } from "express";
import dotenv from "dotenv";
import { createDatabase } from "./infrastructure/postgres/init";
import { VideoManagementUseCases } from "./application/useCases";
import { PostgresRepository } from "./infrastructure/repositories/postgresRepository";
import { FileRepository } from "./infrastructure/repositories/simulatedServiceCloud";
import { pool } from "./infrastructure/postgres/config";
import { router } from "./infrastructure/api/routes/routes";

import { VideoManagementRequest } from "./infrastructure/api/controllers/controllers";
import { setupMiddlewares } from "./infrastructure/api/middlewares/middlewares";
import path from "path";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

// Dependencies injection with connection pool
const postgresRepositoryInstance = new PostgresRepository(pool);
const simulatedServiceCloudInstance = new FileRepository();
const useCases = VideoManagementUseCases.create(
  postgresRepositoryInstance,
  simulatedServiceCloudInstance
);

// Inject useCases
app.use((req: VideoManagementRequest, res, next) => {
  req.useCases = useCases;
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));
// Middlewares
setupMiddlewares(app);
// Routes
app.use("", router);

app.listen(port, async () => {
  await createDatabase(pool);
  // eslint-disable-next-line no-console
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
