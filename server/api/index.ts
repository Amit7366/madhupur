/**
 * Vercel serverless entry. Imports the Express app from `src/` so @vercel/node
 * bundles it; avoids relying on `dist/` inside the function and avoids a file
 * named `app.ts` being mistaken for the serverless entry.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import serverless from "serverless-http";
import { connectDb } from "../src/config/db.js";
import { createApp } from "../src/express-app.js";

let handler: ReturnType<typeof serverless> | null = null;
let ready: Promise<ReturnType<typeof serverless>> | null = null;

async function getHandler(): Promise<ReturnType<typeof serverless>> {
  if (handler) return handler;
  if (!ready) {
    ready = (async () => {
      await connectDb();
      handler = serverless(createApp());
      return handler;
    })();
  }
  return ready;
}

export default async function vercelHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const h = await getHandler();
  await h(req, res);
}
