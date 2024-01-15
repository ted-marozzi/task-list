type OrderPriority = 1 | 2 | 3 | 4;

export type TaskState = {
	name: TaskStateName;
	nextStateName: TaskStateName;
	sortOrder: OrderPriority;
	iconName: null | "loader" | "pause" | "check";
	contextMenuTitle: string;
};

export const taskStates: Record<string, TaskState> = {
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

export function getTaskStateName(taskStateDirective: TaskStateDirective): TaskStateName {
	return taskStateDirective.substring(1) as TaskStateName;
}

export function getTaskStateDirective(taskStateName: TaskStateName): TaskStateDirective {
	return `:${taskStateName}`;
}
