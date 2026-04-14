import mongoose from "mongoose";
import { env } from "./env.js";

/** `1` = connected — skip reconnect if already open. */
export async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
