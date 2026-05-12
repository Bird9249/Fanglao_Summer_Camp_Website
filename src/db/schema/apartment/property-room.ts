import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "../auth";
import { roomListingStatus, roomOccupancyKind } from "./enums";
import { laosDistrict, laosProvince } from "./laos-geo";

export const property = pgTable(
  "property",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    addressLine: text("address_line"),
    provinceCode: text("province_code").references(() => laosProvince.code, {
      onDelete: "restrict",
    }),
    districtCode: text("district_code").references(() => laosDistrict.code, {
      onDelete: "restrict",
    }),
    /** Village / ບ້ານ — free text, distinct values used for admin search suggestions. */
    village: text("village"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    timezone: text("timezone").notNull().default("Asia/Vientiane"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("property_by_province").on(t.provinceCode),
    index("property_by_district").on(t.districtCode),
    index("property_by_village").on(t.village),
  ],
);

export const room = pgTable(
  "room",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    propertyId: text("property_id")
      .notNull()
      .references(() => property.id, { onDelete: "restrict" }),
    roomNumber: text("room_number").notNull(),
    floor: integer("floor"),
    listingStatus: roomListingStatus("listing_status")
      .notNull()
      .default("draft"),
    basePriceAmount: numeric("base_price_amount", {
      precision: 19,
      scale: 4,
    }).notNull(),
    basePriceCurrency: char("base_price_currency", { length: 3 })
      .notNull()
      .default("LAK"),
    computedOccupancy: roomOccupancyKind("computed_occupancy").notNull(),
    manualOccupancyOverride: roomOccupancyKind("manual_occupancy_override"),
    manualOverrideReason: text("manual_override_reason"),
    manualOverrideByUserId: text("manual_override_by_user_id").references(
      () => user.id,
      {
        onDelete: "set null",
      },
    ),
    manualOverrideAt: timestamp("manual_override_at", {
      withTimezone: true,
      mode: "date",
    }),
    filterAttributes: jsonb("filter_attributes").notNull().default({}),
    detailAttributes: jsonb("detail_attributes").notNull().default({}),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (t) => [
    index("room_by_property").on(t.propertyId),
    index("room_listing_computed_occupancy").on(
      t.listingStatus,
      t.computedOccupancy,
    ),
    index("room_base_price").on(t.basePriceAmount),
    index("room_filter_attributes_gin").using("gin", t.filterAttributes),
    uniqueIndex("room_property_number_unique")
      .on(t.propertyId, t.roomNumber)
      .where(sql`${t.deletedAt} is null`),
  ],
);

export const roomMediaAsset = pgTable(
  "room_media_asset",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    roomId: text("room_id")
      .notNull()
      .references(() => room.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    bucket: text("bucket").notNull(),
    objectKey: text("object_key").notNull(),
    contentType: text("content_type"),
    byteSize: bigint("byte_size", { mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("room_media_asset_by_room").on(t.roomId)],
);
