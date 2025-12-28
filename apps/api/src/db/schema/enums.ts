import { pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const unitRoleEnum = pgEnum("unit_role", ["ADMIN", "USER"]);

export const unitTypeEnum = pgEnum("unit_type", [
	"WAREHOUSE",
	"STORE",
	"PICKUP_POINT",
]);

export const companyRoleEnum = pgEnum("company_role", ["ADMIN", "MEMBER"]);

export const companyTypeEnum = pgEnum("company_type", [
	"MEI",
	"LTDA",
	"SA",
	"EIRELI",
	"OTHER",
]);
