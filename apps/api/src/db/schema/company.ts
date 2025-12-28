import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { addressTable } from "@/db/schema/address";
import { companyTypeEnum, statusEnum } from "@/db/schema/enums";
import { unitTable } from "@/db/schema/unit";
import { userTable } from "@/db/schema/user";

export const companyTable = pgTable("companies", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  public_id: uuid("public_id")
    .$defaultFn(() => uuidv7())
    .notNull()
    .unique(),
  name: varchar({ length: 255 }).notNull(),
  legal_name: varchar({ length: 255 }).notNull(),
  cnpj: varchar({ length: 14 }).notNull().unique(),
  company_type: companyTypeEnum().notNull(),
  status: statusEnum().default("ACTIVE").notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});

export const companyRelations = relations(companyTable, ({ many }) => ({
  users: many(userTable),
  addresses: many(addressTable),
  units: many(unitTable),
}));
