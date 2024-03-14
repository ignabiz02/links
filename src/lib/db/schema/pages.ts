import { sql } from "drizzle-orm";
import { text, boolean, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getPages } from "@/lib/api/pages/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const pages = pgTable('pages', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  public: boolean("public").notNull(),
  url: text("url").notNull(),
  backgroundColor: text("background_color").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for pages - used to validate API requests
const baseSchema = createSelectSchema(pages).omit(timestamps)

export const insertPageSchema = createInsertSchema(pages).omit(timestamps);
export const insertPageParams = baseSchema.extend({
  public: z.coerce.boolean()
}).omit({ 
  id: true,
  userId: true
});

export const updatePageSchema = baseSchema;
export const updatePageParams = baseSchema.extend({
  public: z.coerce.boolean()
}).omit({ 
  userId: true
});
export const pageIdSchema = baseSchema.pick({ id: true });

// Types for pages - used to type API request params and within Components
export type Page = typeof pages.$inferSelect;
export type NewPage = z.infer<typeof insertPageSchema>;
export type NewPageParams = z.infer<typeof insertPageParams>;
export type UpdatePageParams = z.infer<typeof updatePageParams>;
export type PageId = z.infer<typeof pageIdSchema>["id"];
    
// this type infers the return from getPages() - meaning it will include any joins
export type CompletePage = Awaited<ReturnType<typeof getPages>>["pages"][number];

