import { Menu, setIcon } from "obsidian";
import {
	taskStates,
	type TaskStateName,
	getTaskState as getTaskStateName,
	setTaskState,
} from "./task_state";
import type TaskList from "./main";

export function renderTaskListBoxes(taskList: TaskList, element: HTMLElement) {
	const listItems = element.findAll("li");

	for (const listItem of listItems) {
		const words = listItem.innerText.trim().split(" ");
		if (words.length < 0) {
			continue;
		}
		const firstWord = words[0];

		switch (firstWord) {
			case ":to-do":
			case ":doing":
			case ":paused":
			case ":done": {
				listItem.innerText = words.slice(1).join(" ");
				listItem.style.display = "block";
				const currentTaskStateName = getTaskStateName(firstWord);

				const iconBox = getTaskStateIconBox(currentTaskStateName);
				listItem.prepend(iconBox);

				const menu = new Menu();

				for (const [taskStateName, taskState] of Object.entries(taskStates)) {
					if (taskStateName !== currentTaskStateName) {
						menu.addItem((item) =>
							item
								.setTitle(taskState.contextMenuTitle)
								.setIcon(taskState.iconName)
								.onClick(() => setTaskState(taskList, taskStateName))
						);
					}
				}

				iconBox.oncontextmenu = (ev) => {
					menu.showAtMouseEvent(ev);
				};
				iconBox.onClickEvent((ev) => {
					setTaskState(taskList, taskStates[currentTaskStateName].nextState);
				});
				break;
			}
			default:
				continue;
		}
	}
}

function getTaskStateIconBox(taskState: TaskStateName) {
	const iconBox = document.createElement("span");

	const iconName = taskStates[taskState].iconName;
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
	iconBox.dataset.state = taskState;

	return iconBox;
}
