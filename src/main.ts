import { Plugin } from "obsidian";
import { logWithNamespace, type LogLevel } from "./log";
import { taskStateViewPlugin } from "./task_state_view_plugin";
import { getSortTaskListCommand } from "./sort_list";
import { taskStatePostProcessor } from "./task_state_post_processor";

export default class TaskList extends Plugin {
	name = this.manifest.name;
	async onload() {
		this.addCommand(getSortTaskListCommand(this));
		this.registerEditorExtension(taskStateViewPlugin);
		this.registerMarkdownPostProcessor(taskStatePostProcessor);
		this.log("info", "loaded");
	}

	onunload() {
		this.log("info", "unloaded");
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		logWithNamespace(null, level, ...messages);
	}
}
