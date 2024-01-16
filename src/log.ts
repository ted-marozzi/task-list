export type LogLevel = "info" | "warn" | "error";

const appName = "[Task list]";

export function logWithNamespace(
	namespace: string | null,
	level: LogLevel,
	...messages: Array<unknown>
) {
	const log = [appName, ...messages];
	if (namespace !== null) {
		log.splice(1, 0, namespace);
	}
	switch (level) {
		case "info":
			console.log("[INFO]", ...log);
			break;
		case "warn":
			console.warn("[WARN]", ...log);
			break;
		case "error":
			console.error("[ERROR]", ...log);
			break;
	}
}
