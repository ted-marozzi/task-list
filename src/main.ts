import { Plugin } from "obsidian";
import { getSortListCommand } from "./sort_list";
import { renderTaskListBoxes } from "./view";

export default class TaskList extends Plugin {
	async onload() {
		this.addCommand(getSortListCommand(this));
		this.registerMarkdownPostProcessor((element) => renderTaskListBoxes(this, element));
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const prefix = `[${this.manifest.name}]`;
		logWithPrefix(prefix, level, ...messages);
	}
}

type LogLevel = "info" | "warn" | "error";

function logWithPrefix(prefix: string, level: LogLevel, ...messages: Array<unknown>) {
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
