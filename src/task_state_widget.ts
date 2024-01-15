import { EditorView, WidgetType } from "@codemirror/view";
import { taskStates, type TaskStateName, type TaskState } from "./task_state";
import { Menu, setIcon, type EditorRange } from "obsidian";
import { type LogLevel, logWithNamespace } from "./log";

export type TaskStateWidgetConstructorArgs = {
	taskStateName: TaskStateName;
	directiveRange: EditorRange;
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
		const iconBox = this.getTaskStateIconBox();

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
						this.replaceDirective(editorView, taskStateName, taskState);
					})
			);
		}

		iconBox.oncontextmenu = (ev) => {
			menu.showAtMouseEvent(ev);
		};
		iconBox.onClickEvent(() => {
			this.replaceDirective(
				editorView,
				this.taskState.nextStateName,
				taskStates[this.taskState.nextStateName]
			);
		});

		return iconBox;
	}

	replaceDirective(editorView: EditorView, taskStateName: TaskStateName, taskState: TaskState) {
		// TODO:
	}

	getTaskStateIconBox() {
		const iconBox = document.createElement("span");

		const iconName = this.taskState.iconName;
		if (iconName !== null) {
			setIcon(iconBox, iconName);
		} else {
			const emptyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "width", "24");
			emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "height", "24");
			emptyIcon.addClass("svg-icon");
			iconBox.appendChild(emptyIcon);
		}

		iconBox.className = "task-state-icon-box";
		iconBox.dataset.state = this.taskStateName;

		return iconBox;
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
