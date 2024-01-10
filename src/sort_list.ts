import { MarkdownView, type Command } from "obsidian";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type TaskList from "./main";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

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
				.use(sortTasks)
				.process(originalMarkdown);

			editor.setValue(modifiedMarkdownFile.toString());
		},
	};
}

function sortTasks() {
	return (mdast: Root) => {
		visit(mdast, "list", (node) => {
			console.debug("node children", node.children);
			node.children.sort((a, b) => {
				if (a.checked === true && !b.checked) {
					return 1;
				}

				if (b.checked === true && !a.checked) {
					return -1;
				}

				return 0;
			});
		});
	};
}
