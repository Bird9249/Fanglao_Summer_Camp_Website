import { index, pgTable, smallint, text } from "drizzle-orm/pg-core";

/**
 * Lao PDR provinces (ນະຄອນຫລວງ, ແຂວງ) — codes align with `laos.json`.
 */
export const laosProvince = pgTable("laos_province", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  nameLo: text("name_lo").notNull(),
  nameEn: text("name_en").notNull(),
  nameTh: text("name_th").notNull(),
  sortOrder: smallint("sort_order").notNull().default(0),
});

/**
 * Districts / ເມືອງ under a province — `province_code` references `laos_province.code`.
 */
export const laosDistrict = pgTable(
  "laos_district",
  {
    code: text("code").primaryKey(),
    provinceCode: text("province_code")
      .notNull()
      .references(() => laosProvince.code, { onDelete: "restrict" }),
    name: text("name").notNull(),
    nameLo: text("name_lo").notNull(),
    nameEn: text("name_en").notNull(),
    nameTh: text("name_th").notNull(),
    sortOrder: smallint("sort_order").notNull().default(0),
  },
  (t) => [index("laos_district_by_province").on(t.provinceCode)],
);

export type LaosProvinceRow = typeof laosProvince.$inferSelect;
export type LaosDistrictRow = typeof laosDistrict.$inferSelect;
