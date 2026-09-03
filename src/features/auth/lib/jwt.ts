export function decodeJwtPayload(
	token: string,
): Record<string, unknown> | null {
	try {
		const part = token.split(".")[1];
		if (!part) return null;
		const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
		const json = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join(""),
		);
		return JSON.parse(json);
	} catch {
		return null;
	}
}

export function extractUserId(token: string): string | null {
	const payload = decodeJwtPayload(token);
	if (!payload) return null;
	const candidates = ["sub", "userId", "uid", "id", "user_id", "nameid"];
	for (const key of candidates) {
		const value = payload[key];
		if (typeof value === "string" && value) return value;
		if (typeof value === "number") return String(value);
	}
	return null;
}
