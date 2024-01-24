import { MarkdownView, type Command } from "obsidian";

import type TaskList from "@src/main";
import { logWithNamespace, type LogLevel } from "@src/base/log";

import { sortTaskList } from "@src/features/sort_task_list/sort";

export function getSortTaskListCommand(taskList: TaskList): Command {
	return {
		id: "sort-lists",
		name: "Sort lists",
		editorCallback: async (editor) => {
			const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
			if (view === null) {
				log("info", "Unable to Sort lists as the current file is not a markdown file.");
				return;
			}

			await sortTaskList({ editorView: editor.cm });
		},
	};
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	const namespace = `[Sort list]`;
	logWithNamespace(namespace, level, ...messages);
}
