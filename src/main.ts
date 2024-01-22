import { Plugin } from "obsidian";
import { logWithNamespace, type LogLevel } from "@src/base/log";
import { taskStateViewPlugin } from "@src/features/render_task_state/task_state_view_plugin";
import { taskStatePostProcessor } from "@src/features/render_task_state/task_state_post_processor";
import { getSortTaskListCommand } from "@src/features/sort_task_list/command";

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
