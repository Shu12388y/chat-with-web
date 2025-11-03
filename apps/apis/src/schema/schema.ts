import { pgTable,varchar } from "drizzle-orm/pg-core";

export const websiteTable = pgTable("websites",{
    websiteURL:varchar({length:256}).notNull(),
    scrappedContent:varchar({length:256})
})