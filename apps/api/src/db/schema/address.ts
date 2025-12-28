import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { companyTable } from "@/db/schema/company";
import { unitTable } from "@/db/schema/unit";

export const addressTable = pgTable("addresses", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	company_id: integer()
		.notNull()
		.references(() => companyTable.id),
	street: varchar({ length: 255 }).notNull(),
	neighborhood: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 255 }).notNull(),
	zip_code: varchar({ length: 10 }).notNull(),
	complement: varchar({ length: 255 }),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp().defaultNow().notNull(),
	deleted_at: timestamp(),
});

export const addressRelations = relations(addressTable, ({ one }) => ({
	unit: one(unitTable, {
		fields: [addressTable.id],
		references: [unitTable.address_id],
	}),
}));
