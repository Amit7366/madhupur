import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

function requireCloudinaryEnv(): {
  cloud_name: string;
  api_key: string;
  api_secret: string;
} {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Image upload requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET",
    );
  }
  return { cloud_name, api_key, api_secret };
}

let configured = false;

function ensureCloudinaryConfig(): void {
  if (configured) return;
  const c = requireCloudinaryEnv();
  cloudinary.config({
    cloud_name: c.cloud_name,
    api_key: c.api_key,
    api_secret: c.api_secret,
  });
  configured = true;
}

export async function uploadComplaintImages(buffers: Buffer[]): Promise<string[]> {
  if (buffers.length === 0) return [];
  ensureCloudinaryConfig();
  const urls: string[] = [];
  for (const buffer of buffers) {
    const url = await new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "madhupur/complaints", resource_type: "auto" },
        (err, result) => {
          if (err) reject(err);
          else if (result?.secure_url) resolve(result.secure_url);
          else reject(new Error("Cloudinary returned no URL"));
        },
      );
      Readable.from(buffer).pipe(stream);
    });
    urls.push(url);
  }
  return urls;
}
