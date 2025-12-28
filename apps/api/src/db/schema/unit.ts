import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { addressTable } from "@/db/schema/address";
import { companyTable } from "@/db/schema/company";
import { statusEnum, unitTypeEnum } from "@/db/schema/enums";
import { userUnitTable } from "@/db/schema/userUnit";

export const unitTable = pgTable(
  "units",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    public_id: uuid("public_id")
      .$defaultFn(() => uuidv7())
      .notNull()
      .unique(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 10 }).notNull().unique(),
    contact_phone: varchar({ length: 15 }).notNull().unique(),
    capacity: integer(),
    status: statusEnum().default("ACTIVE").notNull(),
    unit_type: unitTypeEnum().default("WAREHOUSE").notNull(),
    company_id: integer()
      .notNull()
      .references(() => companyTable.id),
    address_id: integer()
      .notNull()
      .references(() => addressTable.id),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
  },
  (table) => [unique("units_address_unique").on(table.address_id)],
);

export const unitRelations = relations(unitTable, ({ many, one }) => ({
  userUnits: many(userUnitTable),
  address: one(addressTable, {
    fields: [unitTable.address_id],
    references: [addressTable.id],
  }),
}));
