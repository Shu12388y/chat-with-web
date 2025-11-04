/*
DataBase Schema

jobId: Unique UUID ID
websiteURL : String
content: String
status:enums queued | completed

*/

import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

const statusEnum = pgEnum("status", ["queued", "completed"]);

export const webExtractedContent = pgTable("webcontent", {
  jobID: varchar("jobID", { length: 256 }).primaryKey().notNull(),
  websiteUrl: varchar("websiteUrl", { length: 256 }).notNull(),
  content: text("content"),
  status: statusEnum("status").default("queued"),
});