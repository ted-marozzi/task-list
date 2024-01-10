import { MarkdownView, Plugin } from "obsidian";
import { remark } from "remark";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default class TaskList extends Plugin {
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
		console.info(messages);
	}

	async onload() {
		this.addCommand({
			id: "sort-list",
			name: "Sort list",
			editorCallback: async (editor) => {
				editor.listSelections;
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);

				if (view === null) {
					this.log(
						"info",
						"Unable to Sort lists as the current file is not a markdown file."
					);
					return;
				}

				const originalMarkdown = editor.getDoc().getValue();

				const modifiedMarkdownFile = await remark()
					.use(() => (mdast: Root) => {
						visit(mdast, "list", (node) => {
							console.log(node);
						});
					})
					.process(originalMarkdown);

				editor.setValue(modifiedMarkdownFile.toString());
			},
		});
	}

	onunload() {}
}
