export type LogLevel = "info" | "warn" | "error";

const appName = "[Task list]";

export function logWithNamespace(
	namespace: string | null,
	level: LogLevel,
	...messages: Array<unknown>
) {
	const logPrefix = [appName];
	if (namespace !== null) {
		logPrefix.push(namespace);
	}

	logPrefix.push(`[${level}]`);

	switch (level) {
		case "info":
			if (process.env.NODE_ENV !== "production") {
				console.log(...logPrefix, ...messages);
			}
			break;
		case "warn":
			console.warn(...logPrefix, ...messages);
			break;
		case "error":
			console.error(...logPrefix, ...messages);
			break;
	}
}
