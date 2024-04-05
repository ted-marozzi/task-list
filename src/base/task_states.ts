type OrderPriority = 1 | 2 | 3 | 4;

export type TaskState = {
	name: TaskStateName;
	nextStateName: TaskStateName;
	sortOrder: OrderPriority;
	iconName: null | "loader" | "pause" | "check";
	contextMenuTitle: string;
};

export const taskStates = {
	["to-do"]: {
		name: "to-do",
		nextStateName: "doing",
		sortOrder: 2,
		iconName: null,
		contextMenuTitle: "Mark 'To do'",
	},
	["doing"]: {
		name: "doing",
		nextStateName: "done",
		sortOrder: 1,
		iconName: "loader",
		contextMenuTitle: "Mark 'Doing'",
	},
	["paused"]: {
		name: "paused",
		nextStateName: "to-do",
		sortOrder: 3,
		iconName: "pause",
		contextMenuTitle: "Mark 'Paused'",
	},
	["done"]: {
		name: "done",
		nextStateName: "to-do",
		sortOrder: 4,
		iconName: "check",
		contextMenuTitle: "Mark 'Done'",
	},
} as const;

export type TaskStateName = keyof typeof taskStates;
export type TaskStateDirective = `:${TaskStateName}`;

export function getTaskStateNameFromDirective(
	taskStateDirective: TaskStateDirective
): TaskStateName {
	return taskStateDirective.substring(1) as TaskStateName;
}

export function getTaskStateDirectiveName(taskStateName: TaskStateName): TaskStateDirective {
	return `:${taskStateName}`;
}

export function getTaskStateFromText(text: string) {
	return Object.values(taskStates).find(({ name }) =>
		text.trimStart().startsWith(getTaskStateDirectiveName(name))
	);
}
