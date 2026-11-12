const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DASH = "–";

function monthName(month) {
  return MONTHS[month - 1] ?? "";
}

// Formats an item's period, e.g. "May – Jul 2026", "Aug 2025 – Jul 2026",
// "Jun 2026 – Present", or "Oct 2024" when it is a single month.
export function formatPeriod(item) {
  const start = `${monthName(item.start_month)} ${item.start_year}`;

  if (!item.end_month || !item.end_year) {
    return `${start} ${DASH} Present`;
  }

  if (item.end_year === item.start_year) {
    if (item.end_month === item.start_month) return start;
    return `${monthName(item.start_month)} ${DASH} ${monthName(
      item.end_month,
    )} ${item.end_year}`;
  }

  return `${start} ${DASH} ${monthName(item.end_month)} ${item.end_year}`;
}
