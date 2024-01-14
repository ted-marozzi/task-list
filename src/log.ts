export type LogLevel = "info" | "warn" | "error";

export function logWithPrefix(prefix: string, level: LogLevel, ...messages: Array<unknown>) {
	switch (level) {
		case "info":
			console.log(prefix, ...messages);
			break;
		case "warn":
			console.warn(prefix, ...messages);
			break;
		case "error":
			console.error(prefix, ...messages);
			break;
	}
}
