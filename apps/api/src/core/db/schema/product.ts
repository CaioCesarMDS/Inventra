import { sql } from "drizzle-orm";
import {
  check,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const productTable = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    publicId: uuid("public_id").defaultRandom().notNull().unique(),
    sku: varchar("sku", { length: 64 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    description: varchar("description", { length: 255 }),
    brand: varchar("brand", { length: 128 }),
    minStock: integer("min_stock").notNull().default(0),
    costPrice: numeric("cost_price", { precision: 10, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    check("min_stock_not_negative", sql`${table.minStock} >= 0`),
    check("cost_price_not_negative", sql`${table.costPrice} >= 0`),
    check("sale_price_not_negative", sql`${table.salePrice} >= 0`),
  ],
);
