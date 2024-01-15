import { Plugin } from "obsidian";
import { logWithNamespace, type LogLevel } from "./log";
import { taskStateViewPlugin } from "./task_state_view_plugin";
import { getSortTaskListCommand } from "./sort_list";

export default class TaskList extends Plugin {
	name = this.manifest.name;
	async onload() {
		this.addCommand(getSortTaskListCommand(this));
		this.registerEditorExtension(taskStateViewPlugin);
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
