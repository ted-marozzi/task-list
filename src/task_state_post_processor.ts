import type { MarkdownPostProcessorContext } from "obsidian";
import { getTaskStateFromText } from "./base";
import { getTaskStateDirective } from "./task_state";
import { getTaskStateIconBox } from "./elements";

export function taskStatePostProcessor(element: HTMLElement, _: MarkdownPostProcessorContext) {
	const listItems = element.findAll("li:not(.task-list-item)");

	for (const listItem of listItems) {
		const text = listItem.innerText;
		const taskState = getTaskStateFromText(text);
		if (taskState === undefined) {
			continue;
		}
		const directive = getTaskStateDirective(taskState.name);
		listItem.replaceChildren(
			getTaskStateIconBox({ taskState: taskState, interactive: false }),
			text.trimStart().replace(directive, "")
		);
	}
}
