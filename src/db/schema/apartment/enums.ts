import { pgEnum } from "drizzle-orm/pg-core";

export const roomListingStatus = pgEnum("room_listing_status", [
  "draft",
  "listed",
]);

export const roomOccupancyKind = pgEnum("room_occupancy_kind", [
  "vacant",
  "occupied",
  "reserved",
]);

export const leaseStatus = pgEnum("lease_status", [
  "pending",
  "active",
  "ending_soon",
  "ended",
  "cancelled",
]);

/** Lao display strings for each `lease_status` value. */
export const leaseStatusLabelsLo = {
  pending: "ລໍຖ້າເຊັນ",
  active: "ກຳລັງໃຊ້ງານ",
  ending_soon: "ໃກ້ສິ້ນສຸດ",
  ended: "ສິ້ນສຸດແລ້ວ",
  cancelled: "ຍົກເລີກ",
} as const;

export type LeaseStatusValue = keyof typeof leaseStatusLabelsLo;

export function leaseStatusLabelLo(status: string): string {
  return leaseStatusLabelsLo[status as LeaseStatusValue] ?? status;
}

export const billingStatementStatus = pgEnum("billing_statement_status", [
  "open",
  "partial",
  "paid",
  "overdue",
  "void",
]);

export const paymentSubmissionStatus = pgEnum("payment_submission_status", [
  "pending_review",
  "approved",
  "rejected",
]);

/**
 * Stored values in PostgreSQL (stable). For Lao copy in UI, use
 * {@link maintenanceTicketStatusLabelsLo} or {@link maintenanceTicketStatusLabelLo}.
 */
export const maintenanceTicketStatus = pgEnum("maintenance_ticket_status", [
  "queued",
  "in_progress",
  "resolved",
  "closed",
  "cancelled",
]);

/** Lao display strings for each `maintenance_ticket_status` value. */
export const maintenanceTicketStatusLabelsLo = {
  queued: "ລໍຖ້າຄິວ",
  in_progress: "ກຳລັງດຳເນີນການ",
  resolved: "ແກ້ໄຂແລ້ວ",
  closed: "ປິດງານແລ້ວ",
  cancelled: "ຍົກເລີກ",
} as const;

export type MaintenanceTicketStatusValue =
  keyof typeof maintenanceTicketStatusLabelsLo;

/** Lao label for a status value, or the raw string if unknown. */
export function maintenanceTicketStatusLabelLo(status: string): string {
  return (
    maintenanceTicketStatusLabelsLo[status as MaintenanceTicketStatusValue] ??
    status
  );
}

export const amenityBillingUnit = pgEnum("amenity_billing_unit", [
  "per_month",
  "one_time",
  "per_unit",
]);
