import { EditorView } from "@codemirror/view";
import { describe, it, expect } from "vitest";
import { replaceEditorContent } from "@test/base";
import { sortTaskList } from "@src/features/sort_task_list/sort";

describe("sortTaskList", () => {
	const editorView = new EditorView();

	it("should sort an unordered markdown list", async () => {
		replaceEditorContent(
			editorView,
			`
* :done Done
* :doing Doing
* :to-do To do
* :done Done
* :paused Paused
`
		);

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
* :doing Doing
* :to-do To do
* :paused Paused
* :done Done
* :done Done
`);
	});

	it("should sort an ordered markdown list", async () => {
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

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
1. :doing Doing
2. :to-do To do
3. :paused Paused
4. :done Done
5. :done Done
`);
	});

	it("should sort an unordered and unordered markdown list separately", async () => {
		replaceEditorContent(
			editorView,
			`
* :done Done
* :doing Doing
* :to-do To do
* :done Done
* :paused Paused

1. :done Done
2. :doing Doing
3. :to-do To do
4. :done Done
5. :paused Paused
`
		);

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
* :doing Doing
* :to-do To do
* :paused Paused
* :done Done
* :done Done

1. :doing Doing
2. :to-do To do
3. :paused Paused
4. :done Done
5. :done Done
`);
	});

	it("should sort a nested markdown list", async () => {
		const editorView = new EditorView();

		replaceEditorContent(
			editorView,
			`
* :paused List item with ordered children
	1. :done Done
	2. :doing Doing
	3. :to-do To do
	4. :done Done
	5. :paused Paused
* :to-do List item without children
* :done A list item without children that has been done
* :doing List item with unordered children
	* :paused Paused
	* :to-do Do me!
	* :doing Finish me!
* :paused Another list item without children
`
		);

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
* :doing List item with unordered children
	* :doing Finish me!
	* :to-do Do me!
	* :paused Paused
* :to-do List item without children
* :paused List item with ordered children
	1. :doing Doing
	2. :to-do To do
	3. :paused Paused
	4. :done Done
	5. :done Done
* :paused Another list item without children
* :done A list item without children that has been done
`);
	});

	it("should sort an unformatted and poorly ordered markdown list", async () => {
		replaceEditorContent(
			editorView,
			`
1. :done Done
3. :doing Doing
2. :to-do To do


4. :done Done
5. :paused Paused
`
		);

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
1. :doing Doing
3. :to-do To do
2. :paused Paused


4. :done Done
5. :done Done
`);
	});

	it("should sort lists separately when divided by text", async () => {
		replaceEditorContent(
			editorView,
			`
1. :done Done
3. :doing Doing
2. :to-do To do

## Random Text
			This isn't properly formatted but we don't modify it.

4. :done Done
`
		);

		await sortTaskList({ editorView });
		expect(editorView.state.doc.toString()).toBe(`
1. :doing Doing
3. :to-do To do
2. :done Done

## Random Text
			This isn't properly formatted but we don't modify it.

4. :done Done
`);
	});
});
