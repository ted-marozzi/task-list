import { MarkdownView } from "obsidian";
import type TaskList from "./main";

type OrderPriority = 1 | 2 | 3 | 4;

type TaskState = {
	nextState: TaskStateName;
	sortOrder: OrderPriority;
	iconName: null | "loader" | "pause" | "check";
	contextMenuTitle: string;
};

export const taskStates: Record<string, TaskState> = {
	["to-do"]: {
		nextState: "doing",
		sortOrder: 2,
		iconName: null,
		contextMenuTitle: "Mark 'To do'",
	},
	["doing"]: {
		nextState: "done",
		sortOrder: 1,
		iconName: "loader",
		contextMenuTitle: "Mark 'Doing'",
	},
	["paused"]: {
		nextState: "to-do",
		sortOrder: 3,
		iconName: "pause",
		contextMenuTitle: "Mark 'Paused'",
	},
	["done"]: {
		nextState: "to-do",
		sortOrder: 4,
		iconName: "check",
		contextMenuTitle: "Mark 'Done'",
	},
} as const;

export type TaskStateName = keyof typeof taskStates;
export type TaskStateDirective = `:${TaskStateName}`;

export function getTaskState(taskStateDirective: TaskStateDirective): TaskStateName {
	return taskStateDirective.substring(1) as TaskStateName;
}

export async function setTaskState(taskList: TaskList, taskStateName: TaskStateName) {
	const title = taskStates[taskStateName].contextMenuTitle;

	const editor = taskList.app.workspace.activeEditor?.editor;
	if (editor === undefined) {
		taskList.log("info", `Unable to ${title} as there is no active editor.`);
		return;
	}

	const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
	if (view === null) {
		taskList.log("info", `Unable to ${title} as the current file is not a markdown file.`);
		return;
	}

	taskList.log("info", `Running ${title}`);

	// const originalMarkdown = editor.getDoc().getValue();

	// const modifiedMarkdownFile = await remark()
	// 	.use(remarkGfm)
	// 	.use(remarkDirective)
	// 	.use(sortTasks)
	// 	.process(originalMarkdown);

	// editor.setValue(modifiedMarkdownFile.toString());
}
