import express from "express";
import { createApp } from "./express-app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

/** Referenced so `express` is a real import; Vercel’s Express build only scans this file for `import "express"`. */
void express;

async function main() {
  await connectDb();
  const app = createApp();
  if (process.env.VERCEL !== "1") {
    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
