import type { MarkdownPostProcessorContext } from "obsidian";
import { getTaskStateDirective, getTaskStateFromText } from "@src/task_state/task_states";
import { getTaskStateIconBox } from "@src/base/elements";
import { type LogLevel, logWithNamespace } from "../base/log";

export function taskStatePostProcessor(element: HTMLElement, _: MarkdownPostProcessorContext) {
	log("info", "Rendering reading view task states.");
	const listItems = element.findAll("li:not(.task-list-item)");

	for (const listItem of listItems) {
		let iconInserted = false;
		listItem.childNodes.forEach((child) => {
			if (iconInserted || child.nodeType !== Node.TEXT_NODE) {
				return;
			}
			const taskState = getTaskStateFromText(child.nodeValue ?? "");
			if (taskState === undefined) {
				return;
			}
			const directive = getTaskStateDirective(taskState.name);
			if (child.nodeValue === null) {
				return;
			}

			child.nodeValue = child.nodeValue.replace(directive, "");

			listItem.insertBefore(
				getTaskStateIconBox({ taskState: taskState, interactive: false }),
				child
			);

			iconInserted = true;
		});
	}
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	const namespace = `[Task state post processor]`;
	logWithNamespace(namespace, level, ...messages);
}
