import { Plugin } from "obsidian";
import { logWithNamespace, type LogLevel } from "@src/base/log";
import { taskStateViewPlugin } from "@src/task_state/view_plugin";
import { getSortTaskListCommand } from "@src/sort_list/command";
import { taskStatePostProcessor } from "@src/task_state/post_processor";
import { insertOnNewListItem } from "@src/task_state/insert_on_new_list_item";

export default class TaskList extends Plugin {
	name = this.manifest.name;
	async onload() {
		this.addCommand(getSortTaskListCommand(this));
		this.registerEditorExtension(taskStateViewPlugin);
		this.registerMarkdownPostProcessor(taskStatePostProcessor);
		this.registerEditorExtension(insertOnNewListItem());

		this.log("info", "loaded");
	}

	onunload() {
		this.log("info", "unloaded");
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		logWithNamespace(null, level, ...messages);
	}
}
