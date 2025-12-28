import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { companyTable } from "@/db/schema/company";
import { companyRoleEnum, statusEnum } from "@/db/schema/enums";
import { userUnitTable } from "@/db/schema/userUnit";

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  public_id: uuid("public_id")
    .$defaultFn(() => uuidv7())
    .notNull()
    .unique(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 15 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 128 }).notNull(),
  status: statusEnum().default("ACTIVE").notNull(),
  company_role: companyRoleEnum().default("MEMBER").notNull(),
  company_id: integer()
    .notNull()
    .references(() => companyTable.id),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
});

export const userRelations = relations(userTable, ({ one, many }) => ({
  company: one(companyTable, {
    fields: [userTable.company_id],
    references: [companyTable.id],
  }),
  userUnits: many(userUnitTable),
}));
