import { Plugin } from "obsidian";
import { getSortListCommand } from "./sort_list";
import { logWithPrefix, type LogLevel } from "./log";
import { getTaskStateField } from "./task_state_state_plugin";

export default class TaskList extends Plugin {
	async onload() {
		this.addCommand(getSortListCommand(this));
		this.registerEditorExtension(getTaskStateField({ taskList: this }));
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const prefix = `[${this.manifest.name}]`;
		logWithPrefix(prefix, level, ...messages);
	}
}
