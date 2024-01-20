import { EditorView } from "@codemirror/view";
import { describe, it, expect } from "vitest";
import { replaceEditorContent } from "@test/base";
import { sortTaskList } from "@src/sort_list/sort_task_list";

describe("sortTaskList", () => {
	it("should sort a normal markdown list", async () => {
		const editorView = new EditorView();
		expect(editorView.state.doc.toString()).toBe("");

		replaceEditorContent(
			editorView,
			`
1. :done Done
2. :doing Doing
3. :to-do To do
4. :done Done
5. :paused Paused
`
		);

		await sortTaskList(editorView);
		expect(editorView.state.doc.toString()).toBe(`
1. :doing Doing
2. :paused Paused
3. :to-do To do
4. :done Done
5. :done Done
`);
	});
});
