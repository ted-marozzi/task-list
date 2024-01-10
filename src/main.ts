import { MarkdownView, Plugin, type Command } from "obsidian";
import { remark } from "remark";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";

export default class TaskList extends Plugin {
	sortListCommand: Command = {
		id: "sort-list",
		name: "Sort list",
		editorCallback: async (editor) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);

			if (view === null) {
				this.log(
					"info",
					"Unable to Sort lists as the current file is not a markdown file."
				);
				return;
			}

			const originalMarkdown = editor.getDoc().getValue();

			const modifiedMarkdownFile = await remark()
				.use(remarkGfm)
				.use(this.sortTasks)
				.process(originalMarkdown);

			editor.setValue(modifiedMarkdownFile.toString());
		},
	};

	log(level: "info" | "warn" | "error", ...messages: Array<unknown>) {
		const prefix = `[${this.manifest.name}]`;
		switch (level) {
			case "info":
				console.log(prefix, ...messages);
				break;
			case "warn":
				console.warn(prefix, ...messages);
				break;
			case "error":
				console.error(prefix, ...messages);
				break;
		}
	}

	async onload() {
		this.addCommand(this.sortListCommand);
	}

	sortTasks() {
		return (mdast: Root) => {
			visit(mdast, "list", (node) => {
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

	onunload() {}
}
