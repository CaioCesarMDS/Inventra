import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const addressTable = pgTable("addresses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  street: varchar("street", { length: 255 }).notNull(),
  neighborhood: varchar("neighborhood", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  state: varchar("state", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  complement: varchar("complement", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
