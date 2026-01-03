import { relations, sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { addressTable } from "@/core/db/schema/address";
import { statusEnum, unitTypeEnum } from "@/core/db/schema/enums";

export const unitTable = pgTable(
  "units",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    publicId: uuid("public_id").defaultRandom().notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    contactPhone: varchar("contact_phone", { length: 15 }).notNull(),
    totalCapacity: integer("total_capacity"),
    status: statusEnum("status").default("ACTIVE").notNull(),
    type: unitTypeEnum("type").default("WAREHOUSE").notNull(),
    addressId: integer("address_id")
      .notNull()
      .references(() => addressTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    unique("units_address_unique").on(table.addressId),
    check("total_capacity_not_negative", sql`${table.totalCapacity} >= 0`),
  ],
);

export const unitRelations = relations(unitTable, ({ one }) => ({
  address: one(addressTable, {
    fields: [unitTable.addressId],
    references: [addressTable.id],
  }),
}));
