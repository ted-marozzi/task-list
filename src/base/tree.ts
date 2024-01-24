import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { taskStates, type TaskStateName } from "@src/base/task_states";
import type { ListItem } from "mdast";
import type { TextDirective } from "@src/types/mdast";

type TaskStateDirective = {
	name: TaskStateName;
} & TextDirective;

export function getRemark() {
	return remark().use(remarkGfm).use(remarkDirective);
}

export function getTaskStateDirective(listItem: ListItem): TaskStateDirective | null {
	if (
		(listItem.checked === null || listItem.checked === undefined) &&
		listItem.children.length > 0 &&
		listItem.children[0].type === "paragraph" &&
		listItem.children[0].children.length > 0 &&
		listItem.children[0].children[0].type === "textDirective"
	) {
		const taskStateName = listItem.children[0].children[0].name;
		if (taskStateName in taskStates) {
			return listItem.children[0].children[0] as TaskStateDirective;
		}
	}

	return null;
}
