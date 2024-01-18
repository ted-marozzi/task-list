import type { SyntaxNodeRef } from "@lezer/common";

// Returns true if the list isn't a built in task list as we don't render
// our custom task states on pre-existing task lists
export function isValidList(node: SyntaxNodeRef) {
	return (
		node.name.startsWith("list") &&
		node.node.prevSibling?.name !== "formatting_formatting-task_meta" &&
		node.node.prevSibling?.name !== "formatting_formatting-task_property"
	);
}
