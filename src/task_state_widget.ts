import { EditorView, WidgetType } from "@codemirror/view";
import { taskStates, type TaskStateName, type TaskState } from "./task_state";
import { Menu, setIcon, type EditorRange } from "obsidian";
import type TaskList from "./main";

export type TaskStateWidgetConstructorArgs = {
	taskStateName: TaskStateName;
	text: string;
	taskList: TaskList;
	directiveRange: EditorRange;
};

// TODO: try fix this with: https://github.com/erincayaz/obsidian-colored-text/blob/main/src/textFormatting.ts

export class TaskStateWidget extends WidgetType {
	taskStateName;
	taskState;
	text;
	taskList;
	directiveRange: EditorRange;

	constructor({ taskStateName, text, taskList, directiveRange }: TaskStateWidgetConstructorArgs) {
		super();
		this.taskStateName = taskStateName;
		this.taskState = taskStates[this.taskStateName];
		this.text = text;
		this.taskList = taskList;
		this.directiveRange = directiveRange;
	}

	toDOM(_: EditorView): HTMLElement {
		const listItem = document.createElement("li");

		listItem.innerText = this.text;
		listItem.style.display = "block";

		const iconBox = this.getTaskStateIconBox();
		listItem.prepend(iconBox);

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
						this.replaceDirective(taskStateName, taskState);
					})
			);
		}

		iconBox.oncontextmenu = (ev) => {
			menu.showAtMouseEvent(ev);
		};
		iconBox.onClickEvent(() => {
			this.replaceDirective(this.taskState.nextStateName, taskStates[this.taskState.nextStateName]);
		});

		return listItem;
	}

	replaceDirective(taskStateName: TaskStateName, taskState: TaskState) {
		const editor = this.taskList.app.workspace.activeEditor?.editor;
		if (editor === undefined) {
			this.taskList.log(
				"info",
				`Unable to ${taskState.contextMenuTitle} as there is no active editor.`
			);
			return;
		}
		editor.replaceRange(`:${taskStateName}`, this.directiveRange.from, this.directiveRange.to);
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
}
