/**
 * Vercel serverless entry. Run `npm run build` first so `dist/` exists.
 * All routes (e.g. /health, /api/v1/places) are rewritten here — see vercel.json.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import serverless from "serverless-http";

let handler: ReturnType<typeof serverless> | null = null;
let ready: Promise<ReturnType<typeof serverless>> | null = null;

async function getHandler(): Promise<ReturnType<typeof serverless>> {
  if (handler) return handler;
  if (!ready) {
    ready = (async () => {
      const { connectDb } = await import("../dist/config/db.js");
      const { createApp } = await import("../dist/app.js");
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
