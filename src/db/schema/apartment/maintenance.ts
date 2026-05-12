import {
  bigint,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "../auth";
import { maintenanceTicketStatus } from "./enums";
import { lease } from "./lease";

export const maintenanceTicketCategory = pgTable(
  "maintenance_ticket_category",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("maintenance_ticket_category_by_sort").on(t.sortOrder)],
);

export const maintenanceTicket = pgTable(
  "maintenance_ticket",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    leaseId: text("lease_id")
      .notNull()
      .references(() => lease.id, { onDelete: "restrict" }),
    reportedByUserId: text("reported_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    categoryId: text("category_id").references(
      () => maintenanceTicketCategory.id,
      {
        onDelete: "set null",
      },
    ),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: maintenanceTicketStatus("status").notNull().default("queued"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("maintenance_ticket_by_lease").on(t.leaseId),
    index("maintenance_ticket_by_status").on(t.status),
    index("maintenance_ticket_by_category").on(t.categoryId),
  ],
);

export const maintenanceTicketAttachment = pgTable(
  "maintenance_ticket_attachment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => maintenanceTicket.id, { onDelete: "cascade" }),
    bucket: text("bucket").notNull(),
    objectKey: text("object_key").notNull(),
    contentType: text("content_type"),
    byteSize: bigint("byte_size", { mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("maintenance_ticket_attachment_by_ticket").on(t.ticketId)],
);

export const maintenanceAssignment = pgTable(
  "maintenance_assignment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => maintenanceTicket.id, { onDelete: "cascade" }),
    assigneeUserId: text("assignee_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    assignedByUserId: text("assigned_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    note: text("note"),
  },
  (t) => [
    index("maintenance_assignment_by_ticket").on(t.ticketId),
    index("maintenance_assignment_by_assignee").on(t.assigneeUserId),
  ],
);
