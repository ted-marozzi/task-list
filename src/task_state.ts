import { MarkdownView } from "obsidian";
import type TaskList from "./main";

type OrderPriority = 1 | 2 | 3 | 4;

type TaskState = {
	nextState: TaskStateName;
	sortOrder: OrderPriority;
	iconName: null | "loader" | "pause" | "check";
	contextMenu: {
		title: string;
		onClick: (taskList: TaskList, title: string) => unknown;
	};
};

export const taskStates: Record<string, TaskState> = {
	["to-do"]: {
		nextState: "doing",
		sortOrder: 2,
		iconName: null,
		contextMenu: {
			title: "Mark 'To do'",
			onClick: (taskList, title) => {},
		},
	},
	["doing"]: {
		nextState: "paused",
		sortOrder: 1,
		iconName: "loader",
		contextMenu: { title: "Mark 'Doing'", onClick: () => {} },
	},
	["paused"]: {
		nextState: "done",
		sortOrder: 3,
		iconName: "pause",
		contextMenu: { title: "Mark 'Paused'", onClick: () => {} },
	},
	["done"]: {
		nextState: "to-do",
		sortOrder: 4,
		iconName: "check",
		contextMenu: { title: "Mark 'Done'", onClick: () => {} },
	},
} as const;

export type TaskStateName = keyof typeof taskStates;
export type TaskStateDirective = `:${TaskStateName}`;

export function getTaskState(taskStateDirective: TaskStateDirective): TaskStateName {
	return taskStateDirective.substring(1) as TaskStateName;
}

export function setTaskState(taskList: TaskList, taskStateName: TaskStateName) {
	const title = taskStates[taskStateName].contextMenu.title;

	const editor = taskList.app.workspace.activeEditor;
	if (editor === null) {
		taskList.log("info", `Unable to ${title} as there is no active editor.`);
		return;
	}

	const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
	if (view === null) {
		taskList.log("info", `Unable to ${title} as the current file is not a markdown file.`);
		return;
	}

	taskList.log("info", `Running ${title}`);
}
