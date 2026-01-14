import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { statusEnum, userRoleEnum } from "@/core/db/schema/enums";

export const userTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  publicId: uuid("public_id").defaultRandom().notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 128 }).notNull(),
  status: statusEnum("status").default("ACTIVE").notNull(),
  role: userRoleEnum("role").default("VIEWER").notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export const refreshTokensTable = pgTable(
  "refresh_tokens",
  {
    token: uuid("token").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => userTable.publicId)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [index("refresh_tokens_user_id").on(table.userId)],
);
