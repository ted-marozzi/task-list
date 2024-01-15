import { Plugin } from "obsidian";
import { getSortListCommand } from "./sort_list";
import { logWithNamespace, type LogLevel } from "./log";
import { taskStateViewPlugin } from "./task_state_view_plugin";

// TODO: Can we change the reading view render
export default class TaskList extends Plugin {
	name = this.manifest.name;
	async onload() {
		this.addCommand(getSortListCommand(this));
		this.registerEditorExtension(taskStateViewPlugin);
	}

	onunload() {}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
