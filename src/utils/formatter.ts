export function formatTimestampWithTimezone(
  timestamp: bigint | number,
  timeZone: string = "Asia/Jakarta"
): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString("en-US", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const formatTimeLeft = (seconds: bigint) => {
  if (!seconds) return "0";
  if (seconds <= 0n) return "0";

  const days = seconds / 86400n;
  const hours = (seconds % 86400n) / 3600n;
  const minutes = (seconds % 3600n) / 60n;

  return `${days}d ${hours}h ${minutes}m`;
};
