export function formatDate(date?: string | null): string {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "UTC", // Prevent timezone shifting
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateRange(
  from?: string | null,
  to?: string | null
): string {
  return `${formatDate(from)} → ${formatDate(to)}`;
}
