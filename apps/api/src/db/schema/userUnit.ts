import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, unique } from "drizzle-orm/pg-core";
import { unitRoleEnum } from "@/db/schema/enums";
import { unitTable } from "@/db/schema/unit";
import { userTable } from "@/db/schema/user";

export const userUnitTable = pgTable(
  "users_units",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer()
      .notNull()
      .references(() => userTable.id),
    unit_id: integer()
      .notNull()
      .references(() => unitTable.id),
    role: unitRoleEnum().default("USER").notNull(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => [
    unique("users_units_user_unit_unique").on(table.user_id, table.unit_id),
  ],
);

export const userUnitRelations = relations(userUnitTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userUnitTable.user_id],
    references: [userTable.id],
  }),
  unit: one(unitTable, {
    fields: [userUnitTable.unit_id],
    references: [unitTable.id],
  }),
}));
