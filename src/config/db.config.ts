import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from "./index";

let listenersRegistered = false;

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(serverConfig.MONGO_URI!, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    registerDatabaseListeners();
  } catch (error) {
    logger.error("MongoDB Connection Failed", error);
    throw error;
  }
};

const registerDatabaseListeners = () => {
  if (listenersRegistered) return;

  listenersRegistered = true;

  mongoose.connection.on("connected", () => {
    logger.info("MongoDB connection established");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB Error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected");
  });
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error("Error while closing MongoDB connection", error);
  }
};
