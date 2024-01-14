import { Plugin } from "obsidian";
import { getSortListCommand } from "./sort_list";
import { taskStateViewPlugin } from "./task_state_view_plugin";
import { logWithPrefix, type LogLevel } from "./log";

export default class TaskList extends Plugin {
	async onload() {
		this.addCommand(getSortListCommand(this));
		this.registerEditorExtension(taskStateViewPlugin);
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const prefix = `[${this.manifest.name}]`;
		logWithPrefix(prefix, level, ...messages);
	}
}
