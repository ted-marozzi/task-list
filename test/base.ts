import type { EditorView } from "@codemirror/view";

export function replaceEditorContent(editorView: EditorView, string: string) {
	editorView.dispatch({
		changes: [
			{
				from: 0,
				to: editorView.state.doc.length,
				insert: string,
			},
		],
	});
}
