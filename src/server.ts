import express from "express";
import logger from "./config/logger.config";
import { serverConfig } from "./config";
import { connectDB, disconnectDB } from "./config/db.config";

import v1Router from "./routers/v1/index.router";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/v1", v1Router);

app.use(globalErrorHandler);

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(serverConfig.PORT, () => {
      logger.info(`Server running at http://localhost:${serverConfig.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start application", error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down...`);

  if (server) {
    server.close(async () => {
      await disconnectDB();

      logger.info("HTTP server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();
