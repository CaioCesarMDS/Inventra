import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { movementTypeEnum } from "@/core/db/schema/enums";
import { productTable } from "@/core/db/schema/product";
import { unitTable } from "@/core/db/schema/unit";
import { userTable } from "@/core/db/schema/user";

export const stockMovementsTable = pgTable(
  "stock_movements",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    publicId: uuid("public_id").defaultRandom().notNull().unique(),
    idempotencyKey: varchar("idempotency_key", { length: 255 }),
    type: movementTypeEnum("type").notNull(),
    description: varchar("description", { length: 255 }),
    fromUnitId: integer("from_unit_id").references(() => unitTable.id),
    toUnitId: integer("to_unit_id").references(() => unitTable.id),
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("movements_idempotency_unique").on(table.idempotencyKey),
    check(
      "unit_presence_check",
      sql`
        (type = 'IN' AND to_unit_id IS NOT NULL) OR
        (type = 'OUT' AND from_unit_id IS NOT NULL) OR
        (type = 'TRANSFER' AND from_unit_id IS NOT NULL AND to_unit_id IS NOT NULL) OR
        (type = 'ADJUSTMENT')
      `,
    ),
    index("movements_user_id").on(table.userId),
    index("movements_from_unit").on(table.fromUnitId),
    index("movements_to_unit").on(table.toUnitId),
    index("movements_created_at").on(table.createdAt),
  ],
);

export const stockMovementItemsTable = pgTable(
  "stock_movement_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    movementId: integer("movement_id")
      .notNull()
      .references(() => stockMovementsTable.id),
    productId: integer("product_id")
      .notNull()
      .references(() => productTable.id),
    quantity: integer("quantity").notNull(),
    snapshotPrice: numeric("snapshot_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("items_movement_product_unique").on(
      table.movementId,
      table.productId,
    ),
    check("quantity_positive", sql`${table.quantity} > 0`),
    index("items_product_id").on(table.productId),
  ],
);

export const stockMovementsRelations = relations(
  stockMovementsTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [stockMovementsTable.userId],
      references: [userTable.id],
    }),
    fromUnit: one(unitTable, {
      fields: [stockMovementsTable.fromUnitId],
      references: [unitTable.id],
    }),
    toUnit: one(unitTable, {
      fields: [stockMovementsTable.toUnitId],
      references: [unitTable.id],
    }),
    items: many(stockMovementItemsTable),
  }),
);

export const stockMovementItemsRelations = relations(
  stockMovementItemsTable,
  ({ one }) => ({
    movement: one(stockMovementsTable, {
      fields: [stockMovementItemsTable.movementId],
      references: [stockMovementsTable.id],
    }),
    product: one(productTable, {
      fields: [stockMovementItemsTable.productId],
      references: [productTable.id],
    }),
  }),
);
