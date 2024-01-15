export type LogLevel = "info" | "warn" | "error";

const appName = "[Task list]";

export function logWithNamespace(namespace: string, level: LogLevel, ...messages: Array<unknown>) {
	switch (level) {
		case "info":
			console.log(appName, namespace, ...messages);
			break;
		case "warn":
			console.warn(appName, namespace, ...messages);
			break;
		case "error":
			console.error(appName, namespace, ...messages);
			break;
	}
}
