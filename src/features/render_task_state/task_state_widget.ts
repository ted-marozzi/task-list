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

		menu.addItem((item) => {
			item.setTitle("Sort list").onClick(async () => {
				// TODO only sort this one
				await sortTaskList(editorView);
			});
		});

		menu.addSeparator();

		for (const otherTaskState of otherTaskStates) {
			menu.addItem((item) =>
				item.setTitle(otherTaskState.contextMenuTitle).onClick(() => {
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
		this.log("info", `replacing task directive with ${taskStateDirective}`);
		editorView.dispatch({
			changes: {
				insert: taskStateDirective,
				from: this.directiveRange.from,
				to: this.directiveRange.to,
			},
		});
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
