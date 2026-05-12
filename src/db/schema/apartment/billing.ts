import { sql } from "drizzle-orm";
import {
  bigint,
  char,
  date,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { user } from "../auth";
import { billingStatementStatus, paymentSubmissionStatus } from "./enums";
import { lease } from "./lease";

export const billingStatement = pgTable(
  "billing_statement",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    leaseId: text("lease_id")
      .notNull()
      .references(() => lease.id, { onDelete: "restrict" }),
    periodStart: date("period_start", { mode: "date" }).notNull(),
    periodEnd: date("period_end", { mode: "date" }).notNull(),
    currency: char("currency", { length: 3 }).notNull().default("LAK"),
    rentAmount: numeric("rent_amount", { precision: 19, scale: 4 }).notNull(),
    amenitiesAmount: numeric("amenities_amount", { precision: 19, scale: 4 })
      .notNull()
      .default("0"),
    totalDue: numeric("total_due", { precision: 19, scale: 4 }).notNull(),
    amountPaid: numeric("amount_paid", { precision: 19, scale: 4 })
      .notNull()
      .default("0"),
    status: billingStatementStatus("status").notNull().default("open"),
    lineItems: jsonb("line_items").notNull().default([]),
    dueDate: date("due_date", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("billing_statement_by_lease").on(t.leaseId),
    index("billing_statement_by_status").on(t.status),
    uniqueIndex("billing_statement_lease_period_unique").on(
      t.leaseId,
      t.periodStart,
    ),
  ],
);

export const paymentSubmission = pgTable(
  "payment_submission",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    submittedByUserId: text("submitted_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    leaseId: text("lease_id")
      .notNull()
      .references(() => lease.id, { onDelete: "restrict" }),
    billingStatementId: text("billing_statement_id").references(
      () => billingStatement.id,
      {
        onDelete: "set null",
      },
    ),
    amount: numeric("amount", { precision: 19, scale: 4 }).notNull(),
    currency: char("currency", { length: 3 }).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true, mode: "date" }),
    status: paymentSubmissionStatus("status")
      .notNull()
      .default("pending_review"),
    reviewedByUserId: text("reviewed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: "date" }),
    rejectionReason: text("rejection_reason"),
    slipBucket: text("slip_bucket").notNull(),
    slipObjectKey: text("slip_object_key").notNull(),
    slipContentType: text("slip_content_type"),
    slipByteSize: bigint("slip_byte_size", { mode: "number" }),
    notesInternal: text("notes_internal"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("payment_submission_by_lease").on(t.leaseId),
    index("payment_submission_by_billing").on(t.billingStatementId),
    index("payment_submission_pending_idx")
      .on(t.createdAt)
      .where(sql`${t.status} = 'pending_review'`),
  ],
);

export const paymentAllocation = pgTable(
  "payment_allocation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    paymentSubmissionId: text("payment_submission_id")
      .notNull()
      .references(() => paymentSubmission.id, { onDelete: "restrict" }),
    billingStatementId: text("billing_statement_id")
      .notNull()
      .references(() => billingStatement.id, { onDelete: "restrict" }),
    allocatedAmount: numeric("allocated_amount", {
      precision: 19,
      scale: 4,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("payment_allocation_by_submission").on(t.paymentSubmissionId),
    index("payment_allocation_by_billing").on(t.billingStatementId),
  ],
);

export const digitalReceipt = pgTable(
  "digital_receipt",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    receiptNumber: text("receipt_number").notNull().unique(),
    paymentSubmissionId: text("payment_submission_id")
      .notNull()
      .references(() => paymentSubmission.id, { onDelete: "restrict" }),
    leaseId: text("lease_id")
      .notNull()
      .references(() => lease.id, { onDelete: "restrict" }),
    issuedAt: timestamp("issued_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    issuedByUserId: text("issued_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    pdfBucket: text("pdf_bucket"),
    pdfObjectKey: text("pdf_object_key"),
    totalsSnapshot: jsonb("totals_snapshot").notNull().default({}),
  },
  (t) => [
    index("digital_receipt_by_lease").on(t.leaseId),
    index("digital_receipt_by_submission").on(t.paymentSubmissionId),
  ],
);
