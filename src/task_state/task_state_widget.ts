import { EditorView, WidgetType } from "@codemirror/view";
import {
	taskStates,
	type TaskStateName,
	type TaskStateDirective,
	getTaskStateDirective,
	type TaskState,
} from "@src/task_state/task_states";
import { Menu } from "obsidian";
import { type LogLevel, logWithNamespace } from "../base/log";
import { getTaskStateIconBox } from "../base/elements";
import { sortTaskList } from "@src/sort_list/sort_task_list";

export type TaskStateWidgetConstructorArgs = {
	taskStateName: TaskStateName;
	directiveRange: { from: number; to: number };
};

export class TaskStateWidget extends WidgetType {
	name = "TaskStateWidget";
	taskStateName: TaskStateName;
	taskState: TaskState;
	directiveRange;

	constructor({ taskStateName, directiveRange }: TaskStateWidgetConstructorArgs) {
		super();
		this.taskStateName = taskStateName;
		this.taskState = taskStates[this.taskStateName];
		this.directiveRange = directiveRange;
	}

	toDOM(editorView: EditorView): HTMLElement {
		const iconBox = getTaskStateIconBox({ taskState: this.taskState, interactive: true });

		const menu = new Menu();

		const otherTaskStates = Object.values(taskStates).filter(
			(taskState) => taskState.name !== this.taskStateName
		);

		for (const otherTaskState of otherTaskStates) {
			menu.addItem((item) =>
				item
					.setTitle(otherTaskState.contextMenuTitle)
					.setIcon(otherTaskState.iconName)
					.onClick(() => {
						this.replaceDirective(editorView, getTaskStateDirective(otherTaskState.name));
					})
			);
		}

		iconBox.oncontextmenu = (ev) => {
			menu.showAtMouseEvent(ev);
		};
		iconBox.onClickEvent(() => {
			this.replaceDirective(editorView, getTaskStateDirective(this.taskState.nextStateName));
		});

		return iconBox;
	}

	async replaceDirective(editorView: EditorView, taskStateDirective: TaskStateDirective) {
		this.log("info", `replacing task directive with ${taskStateDirective}`);
		editorView.dispatch({
			changes: {
				insert: taskStateDirective,
				from: this.directiveRange.from,
				to: this.directiveRange.to,
			},
		});

		await sortTaskList(editorView);
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
