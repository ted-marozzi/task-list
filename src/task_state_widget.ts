import { EditorView, WidgetType } from "@codemirror/view";
import type { TaskStateName } from "./task_state";

export class TaskStateListItemWidget extends WidgetType {
	taskStateName;
	text;

	constructor(taskStateName: TaskStateName, text: string) {
		super();
		this.taskStateName = taskStateName;
		this.text = text;
	}

	toDOM(_: EditorView): HTMLElement {
		const listItem = document.createElement("li");

		listItem.innerText = this.text;
		listItem.style.display = "block";

		return listItem;
	}
}
