import { Plugin } from "obsidian";
import { getSortListCommand } from "./sort_list";

export default class TaskList extends Plugin {
	async onload() {
		this.addCommand(getSortListCommand(this));
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const prefix = `[${this.manifest.name}]`;
		log(prefix, level, messages);
	}
}

type LogLevel = "info" | "warn" | "error";

function log(prefix: string, level: LogLevel, ...messages: Array<unknown>) {
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
