import type mongoose from "mongoose";

/** Reads virtual `id` or `_id` from a Mongoose document when InferSchemaType omits them. */
export function readDocumentId(doc: mongoose.Document): string {
  return doc.id;
}
