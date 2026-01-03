import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";
import { productTable } from "@/core/db/schema/product";
import { unitTable } from "@/core/db/schema/unit";

export const productStockTable = pgTable(
  "product_stocks",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => productTable.id),
    unitId: integer("unit_id")
      .notNull()
      .references(() => unitTable.id),
    quantity: integer("quantity").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.unitId] }),
    check("quantity_not_negative", sql`${table.quantity} >= 0`),
    index("product_stock_unit_id").on(table.unitId),
  ],
);
