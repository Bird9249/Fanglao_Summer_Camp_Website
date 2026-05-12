import { sql } from "drizzle-orm";
import {
  char,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "../auth";
import { amenity } from "./amenity";
import { leaseStatus } from "./enums";
import { room } from "./property-room";

export const lease = pgTable(
  "lease",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    tenantUserId: text("tenant_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    roomId: text("room_id")
      .notNull()
      .references(() => room.id, { onDelete: "restrict" }),
    status: leaseStatus("status").notNull(),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }).notNull(),
    signedAt: timestamp("signed_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("lease_by_tenant").on(t.tenantUserId),
    index("lease_by_room").on(t.roomId),
    uniqueIndex("one_active_lease_per_room")
      .on(t.roomId)
      .where(sql`${t.status} = 'active'`),
  ],
);

export const leaseAmenitySelection = pgTable(
  "lease_amenity_selection",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    leaseId: text("lease_id")
      .notNull()
      .references(() => lease.id, { onDelete: "cascade" }),
    amenityId: text("amenity_id")
      .notNull()
      .references(() => amenity.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull().default(1),
    unitPriceSnapshot: numeric("unit_price_snapshot", {
      precision: 19,
      scale: 4,
    }).notNull(),
    currencySnapshot: char("currency_snapshot", { length: 3 }).notNull(),
    effectiveFrom: date("effective_from", { mode: "date" }).notNull(),
    effectiveTo: date("effective_to", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("lease_amenity_selection_by_lease").on(t.leaseId),
    index("lease_amenity_selection_by_amenity").on(t.amenityId),
  ],
);
