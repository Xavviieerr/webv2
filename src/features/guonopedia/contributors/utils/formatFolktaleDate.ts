const MONTHS_SHORT = [
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

/**
 * Format an ISO date for folktale cards. Using a fixed formatter keeps the
 * server and client output aligned and avoids locale hydration mismatches.
 */
export function formatFolktaleDate(value?: string | null): string {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const day = date.getDate();
	const month = MONTHS_SHORT[date.getMonth()];
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
}

export function formatFolktaleDateTime(value?: string | null): string {
	const formatted = formatFolktaleDate(value);
	return formatted;
}
