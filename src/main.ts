import { logWithNamespace, type LogLevel } from "@src/base/log";
import { taskStatePostProcessor } from "@src/features/render_task_state/task_state_post_processor";
import { taskStateViewPlugin } from "@src/features/render_task_state/task_state_view_plugin";
import { getSortTaskListCommand } from "@src/features/sort_task_list/command";
import { Plugin } from "obsidian";
import { sortTaskList } from "@src/features/sort_task_list/sort";

export default class TaskList extends Plugin {
	name = this.manifest.name;
	async onload() {
		this.addCommand(getSortTaskListCommand(this));
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, _view) => {
				menu.addItem((item) => {
					item.setTitle("Task list: Sort lists").onClick(async () => {
						await sortTaskList({ editorView: editor.cm });
					});
				});
			})
		);
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
