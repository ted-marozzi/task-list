import { MarkdownView, type Command } from "obsidian";

import type TaskList from "../main";
import { logWithNamespace, type LogLevel } from "../base/log";

import { sortTaskList } from "./sort_task_list";

export function getSortTaskListCommand(taskList: TaskList): Command {
	return {
		id: "sort-list",
		name: "Sort list",
		editorCallback: async (editor) => {
			const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
			if (view === null) {
				log("info", "Unable to Sort lists as the current file is not a markdown file.");
				return;
			}

			await sortTaskList(editor.cm);
		},
	};
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	const namespace = `[Sort list]`;
	logWithNamespace(namespace, level, ...messages);
}
