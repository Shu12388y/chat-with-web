import { drizzle } from "drizzle-orm/neon-http";
import {webExtractedContent} from "./schemas/schema.js"

export const db = ({ uri }: { uri: string }) => {
  if (!uri) {
    throw new Error("Database URI is required");
  }

  const dbRef = drizzle(uri);
  return dbRef;
};

export const webcontentTable = webExtractedContent;
