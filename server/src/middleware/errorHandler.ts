import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof MulterError) {
    res.status(400).json({
      success: false,
      error:
        err.code === "LIMIT_FILE_SIZE"
          ? "Each image must be 5MB or smaller"
          : err.code === "LIMIT_FILE_COUNT"
            ? "Too many images (max 10)"
            : err.message,
    });
    return;
  }

  if (err instanceof Error && err.message === "Only image uploads are allowed") {
    res.status(400).json({ success: false, error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  const status =
    typeof (err as { status?: number })?.status === "number"
      ? (err as { status: number }).status
      : 500;
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({
    success: false,
    error: message,
  });
}
