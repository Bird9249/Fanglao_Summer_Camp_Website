import {
  boolean,
  char,
  index,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { amenityBillingUnit } from "./enums";
import { room } from "./property-room";

export const amenity = pgTable("amenity", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  billingUnit: amenityBillingUnit("billing_unit").notNull(),
  defaultUnitPrice: numeric("default_unit_price", {
    precision: 19,
    scale: 4,
  }).notNull(),
  defaultCurrency: char("default_currency", { length: 3 })
    .notNull()
    .default("LAK"),
  metadata: jsonb("metadata").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const roomAmenity = pgTable(
  "room_amenity",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => room.id, { onDelete: "cascade" }),
    amenityId: text("amenity_id")
      .notNull()
      .references(() => amenity.id, { onDelete: "restrict" }),
    isOptionalAddon: boolean("is_optional_addon").notNull().default(true),
    /**
     * When true: do not include this link in optional add-on price totals (invoicing / quotes).
     * Always effectively true when `is_optional_addon` is false (bundled with room).
     */
    excludeFromAddonPricing: boolean("exclude_from_addon_pricing")
      .notNull()
      .default(false),
    overrideUnitPrice: numeric("override_unit_price", {
      precision: 19,
      scale: 4,
    }),
    overrideCurrency: char("override_currency", { length: 3 }),
  },
  (t) => [
    primaryKey({ columns: [t.roomId, t.amenityId], name: "room_amenity_pk" }),
    index("room_amenity_by_amenity").on(t.amenityId),
  ],
);
