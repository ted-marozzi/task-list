type OrderPriority = 1 | 2 | 3 | 4;

type TaskState = {
	nextState: TaskStateName;
	sortOrder: OrderPriority;
	iconName: null | "loader" | "pause" | "check";
	contextMenu: {
		title: string;
		onClick: (evt: MouseEvent | KeyboardEvent) => unknown;
	};
};

export const taskStates: Record<string, TaskState> = {
	["to-do"]: {
		nextState: "doing",
		sortOrder: 2,
		iconName: null,
		contextMenu: { title: "Mark 'To do'", onClick: () => {} },
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

export function getTaskState(
	taskStateDirective: TaskStateDirective
): TaskStateName {
	return taskStateDirective.substring(1) as TaskStateName;
}
