import { EditorView, WidgetType } from "@codemirror/view";
import {
	taskStates,
	type TaskStateName,
	type TaskStateDirective,
	getTaskStateDirectiveName,
	type TaskState,
} from "@src/base/task_states";
import { Menu } from "obsidian";
import { type LogLevel, logWithNamespace } from "@src/base/log";
import { getTaskStateIconBox } from "@src/base/elements";
import { sortTaskList } from "@src/features/sort_task_list/sort";
import type { Position } from "unist";

export type TaskStateWidgetConstructorArgs = {
	taskStateName: TaskStateName;
	directivePosition: Position;
	listPosition: Position;
};

export class TaskStateWidget extends WidgetType {
	name = "TaskStateWidget";
	taskStateName: TaskStateName;
	taskState: TaskState;
	directivePosition;
	listPosition;

	constructor({ taskStateName, directivePosition, listPosition }: TaskStateWidgetConstructorArgs) {
		super();
		this.taskStateName = taskStateName;
		this.taskState = taskStates[this.taskStateName];
		this.directivePosition = directivePosition;
		this.listPosition = listPosition;
	}

	toDOM(editorView: EditorView): HTMLElement {
		const iconBox = getTaskStateIconBox({ taskState: this.taskState, interactive: true });

		const menu = new Menu();

		const otherTaskStates = Object.values(taskStates).filter(
			(taskState) => taskState.name !== this.taskStateName
		);

		menu.addItem((item) => {
			item
				.setTitle("Sort list")
				.setIcon("arrow-up-down")
				.onClick(async () => {
					await sortTaskList({ editorView, position: this.listPosition });
				});
		});

		menu.addSeparator();

		for (const otherTaskState of otherTaskStates) {
			menu.addItem((item) =>
				item
					.setTitle(otherTaskState.contextMenuTitle)
					.setIcon(otherTaskState.iconName)
					.onClick(() => {
						this.replaceDirective(editorView, getTaskStateDirectiveName(otherTaskState.name));
					})
			);
		}

		iconBox.oncontextmenu = (ev) => {
			menu.showAtMouseEvent(ev);
		};
		iconBox.onClickEvent(() => {
			this.replaceDirective(editorView, getTaskStateDirectiveName(this.taskState.nextStateName));
		});

		return iconBox;
	}

	async replaceDirective(editorView: EditorView, taskStateDirective: TaskStateDirective) {
		this.log("info", `Replacing task directive with ${taskStateDirective}`);
		if (!this.directivePosition.start.offset || !this.directivePosition.end.offset) {
			this.log("error", "Unable to replace task directive as its position is unknown.");
			return;
		}
		editorView.dispatch({
			changes: {
				insert: taskStateDirective,
				from: this.directivePosition.start.offset,
				to: this.directivePosition.end.offset,
			},
		});
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
