import { MarkdownView, type Command } from "obsidian";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import type TaskList from "./main";
import { visit } from "unist-util-visit";
import type { Root } from "remark-gfm/lib";
import type { ListItem } from "mdast";

export function getSortListCommand(taskList: TaskList): Command {
	return {
		id: "sort-list",
		name: "Sort list",
		editorCallback: async (editor) => {
			const view = taskList.app.workspace.getActiveViewOfType(MarkdownView);
			if (view === null) {
				taskList.log(
					"info",
					"Unable to Sort lists as the current file is not a markdown file."
				);
				return;
			}

			taskList.log("info", "Running command");

			const originalMarkdown = editor.getDoc().getValue();

			const modifiedMarkdownFile = await remark()
				.use(remarkGfm)
				.use(remarkDirective)
				.use(() => sortTasks(taskList))
				.process(originalMarkdown);

			editor.setValue(modifiedMarkdownFile.toString());
		},
	};
}
type SortPriority = 1 | 2 | 3 | 4 | 5;
const listItemStates = ["doing", "todo", "paused", "done", "none"] as const;
type ListItemState = (typeof listItemStates)[number];

const sortOrder = new Map<ListItemState, SortPriority>([
	["doing", 1],
	["todo", 2],
	["paused", 3],
	["done", 4],
	["none", 5],
]);

function sortTasks(taskList: TaskList) {
	return (root: Root) => {
		visit(root, "list", (node) => {
			node.children.sort((a, b) => {
				const sortOrderA = sortOrder.get(getState(a));
				const sortOrderB = sortOrder.get(getState(b));

				if (sortOrderA === undefined || sortOrderB === undefined) {
					return 0;
				}

				return sortOrderA - sortOrderB;
			});
		});
	};
}

type TextDirective = {
	type: "textDirective";
	name: string;
};

declare module "mdast" {
	interface PhrasingContentMap {
		textDirective: TextDirective;
	}
}

function getState(listItem: ListItem): ListItemState {
	if (
		listItem.children.length > 0 &&
		listItem.children[0].type === "paragraph" &&
		listItem.children[0].children.length > 0 &&
		listItem.children[0].children[0].type === "textDirective"
	) {
		const state: ListItemState | string = listItem.children[0].children[0].name;
		switch (state) {
			case "doing":
			case "todo":
			case "paused":
			case "done":
				return state;
		}
	}

	return "none";
}
