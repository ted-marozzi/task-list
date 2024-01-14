import { MarkdownView, type Command } from "obsidian";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import type TaskList from "./main";
import { visit } from "unist-util-visit";
import type { Root } from "remark-gfm/lib";
import type { ListItem } from "mdast";
import { taskStates, type TaskStateName } from "./task_state";

declare module "mdast" {
	interface PhrasingContentMap {
		textDirective: TextDirective;
	}
}

type TextDirective = {
	type: "textDirective";
	name: string;
};

export function getSortListCommand(taskList: TaskList): Command {
	return {
		id: "sort-list",
		name: "Sort list",
		editorCallback: async (editor) => {
			const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
			if (view === null) {
				taskList.log("info", "Unable to Sort lists as the current file is not a markdown file.");
				return;
			}

			taskList.log("info", "Running command");

			const originalMarkdown = editor.getDoc().getValue();

			const modifiedMarkdownFile = await remark()
				.use(remarkGfm)
				.use(remarkDirective)
				.use(sortTasks)
				.process(originalMarkdown);

			editor.setValue(modifiedMarkdownFile.toString());
		},
	};
}

function sortTasks() {
	return (root: Root) => {
		visit(root, "list", (node) => {
			node.children.sort((a, b) => {
				const stateA = getState(a);
				const stateB = getState(b);

				if (stateA === stateB) {
					return 0;
				}

				if (stateA === null) {
					return 1;
				}

				if (stateB === null) {
					return -1;
				}

				const sortOrderA = taskStates[stateA].sortOrder;
				const sortOrderB = taskStates[stateB].sortOrder;

				return sortOrderA - sortOrderB;
			});
		});
	};
}

function getState(listItem: ListItem): TaskStateName | null {
	if (
		(listItem.checked === null || listItem.checked === undefined) &&
		listItem.children.length > 0 &&
		listItem.children[0].type === "paragraph" &&
		listItem.children[0].children.length > 0 &&
		listItem.children[0].children[0].type === "textDirective"
	) {
		const state = listItem.children[0].children[0].name;
		if (state in taskStates) {
			return state as TaskStateName;
		}
	}

	return null;
}
