import { ShowcaseStatus } from "@/gen/erp/showcase/v1/showcase_pb";

export type StatusFilter = "all" | "active" | "on_hold" | "archived";

export const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "archived", label: "Archived" },
];

export function statusLabel(status: ShowcaseStatus): string {
  if (status === ShowcaseStatus.ACTIVE) return "Active";
  if (status === ShowcaseStatus.ON_HOLD) return "On hold";
  if (status === ShowcaseStatus.ARCHIVED) return "Archived";
  return "Unknown";
}

export function statusTag(status: ShowcaseStatus): "green" | "red" | "gray" {
  if (status === ShowcaseStatus.ACTIVE) return "green";
  if (status === ShowcaseStatus.ON_HOLD) return "red";
  return "gray";
}

export function statusFromFilter(value: StatusFilter): ShowcaseStatus {
  if (value === "active") return ShowcaseStatus.ACTIVE;
  if (value === "on_hold") return ShowcaseStatus.ON_HOLD;
  if (value === "archived") return ShowcaseStatus.ARCHIVED;
  return ShowcaseStatus.UNSPECIFIED;
}

export function filterFromParam(value: string | null): StatusFilter {
  return statusOptions.some((item) => item.value === value)
    ? (value as StatusFilter)
    : "all";
}
