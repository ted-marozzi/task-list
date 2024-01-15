import type { SyntaxNodeRef } from "@lezer/common";
import { getTaskStateDirective, taskStates } from "./task_state";

// Returns true if the list isn't a built in task list as we don't render
// our custom task states on pre-existing task lists
export function isValidList(node: SyntaxNodeRef) {
	return (
		node.name.startsWith("list") &&
		node.node.prevSibling?.name !== "formatting_formatting-task_meta"
	);
}

export function getTaskStateFromText(text: string) {
	return Object.values(taskStates).find(({ name }) =>
		text.trimStart().startsWith(getTaskStateDirective(name))
	);
}
