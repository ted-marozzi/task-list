import { setIcon } from "obsidian";
import type { TaskState } from "./task_state";

export function getTaskStateIconBox({
	taskState,
	interactive,
}: {
	taskState: TaskState;
	interactive: boolean;
}) {
	const iconBox = document.createElement("span");

	if (taskState.iconName !== null) {
		setIcon(iconBox, taskState.iconName);
	} else {
		const emptyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "width", "24");
		emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "height", "24");
		emptyIcon.addClass("svg-icon");
		iconBox.appendChild(emptyIcon);
	}

	iconBox.addClass("task-state-icon-box");
	if (interactive) {
		iconBox.addClass("interactive");
	}

	iconBox.dataset.state = taskState.name;

	return iconBox;
}
