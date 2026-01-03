import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "OPERATOR",
  "VIEWER",
]);

export const unitTypeEnum = pgEnum("unit_type", [
  "WAREHOUSE",
  "STORE",
  "PICKUP_POINT",
]);

export const movementTypeEnum = pgEnum("movement_type", [
  "IN",
  "OUT",
  "ADJUSTMENT",
  "TRANSFER",
]);
