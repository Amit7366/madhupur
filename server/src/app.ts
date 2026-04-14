import cors from "cors";
import express, { type RequestHandler } from "express";
import type { HelmetOptions } from "helmet";
import morgan from "morgan";
import { createRequire } from "node:module";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/index.js";

/** Helmet’s ESM typings resolve to a non-callable module type under NodeNext; CJS export is the real middleware factory. */
const require = createRequire(import.meta.url);
const helmet = require("helmet") as (
  options?: Readonly<HelmetOptions>,
) => RequestHandler;

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigins,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Accept"],
    }),
  );
  app.use(express.json({ limit: "512kb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/v1", apiRouter);

  app.use(errorHandler);

  return app;
}
