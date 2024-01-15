import { EditorView, WidgetType } from "@codemirror/view";
import {
	taskStates,
	type TaskStateName,
	type TaskStateDirective,
	getTaskStateDirective,
} from "./task_state";
import { Menu } from "obsidian";
import { type LogLevel, logWithNamespace } from "./log";
import { sortTaskList } from "./sort_list";
import { getTaskStateIconBox } from "./elements";

export type TaskStateWidgetConstructorArgs = {
	taskStateName: TaskStateName;
	directiveRange: { from: number; to: number };
};

export class TaskStateWidget extends WidgetType {
	name = "TaskStateWidget";
	taskStateName;
	taskState;
	directiveRange;

	constructor({ taskStateName, directiveRange }: TaskStateWidgetConstructorArgs) {
		super();
		this.taskStateName = taskStateName;
		this.taskState = taskStates[this.taskStateName];
		this.directiveRange = directiveRange;
	}

	toDOM(editorView: EditorView): HTMLElement {
		const iconBox = getTaskStateIconBox(this.taskState.iconName);

		const menu = new Menu();

		const otherTaskStates = Object.entries(taskStates).filter(
			([taskStateName]) => taskStateName !== this.taskStateName
		);

		for (const [taskStateName, taskState] of otherTaskStates) {
			menu.addItem((item) =>
				item
					.setTitle(taskState.contextMenuTitle)
					.setIcon(taskState.iconName)
					.onClick(() => {
						this.replaceDirective(editorView, getTaskStateDirective(taskStateName));
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
		editorView.dispatch({
			changes: {
				insert: taskStateDirective,
				from: this.directiveRange.from,
				to: this.directiveRange.to,
			},
		});

		const sortedDoc = await sortTaskList(editorView.state.doc.toString());
		editorView.dispatch({
			changes: {
				insert: sortedDoc,
				from: 0,
				to: sortedDoc.length,
			},
		});
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
