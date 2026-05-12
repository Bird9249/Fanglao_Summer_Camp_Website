import {
  char,
  date,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const exchangeRate = pgTable(
  "exchange_rate",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    baseCurrency: char("base_currency", { length: 3 }).notNull().default("LAK"),
    quoteCurrency: char("quote_currency", { length: 3 }).notNull(),
    rate: numeric("rate", { precision: 19, scale: 8 }).notNull(),
    validOn: date("valid_on", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("exchange_rate_base_quote_day_unique").on(
      t.baseCurrency,
      t.quoteCurrency,
      t.validOn,
    ),
    index("exchange_rate_by_valid_on").on(t.validOn),
  ],
);
