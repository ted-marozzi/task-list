import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	type PluginValue,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";
import { TaskStateWidget } from "./task_state_widget";
import { type LogLevel, logWithNamespace } from "./log";
import { getTaskStateDirective, taskStates } from "./task_state";

class TaskStateViewValue implements PluginValue {
	name = "TaskStateViewValue";
	decorations: DecorationSet;

	constructor(editorView: EditorView) {
		this.decorations = this.buildDecorations(editorView);
	}

	update(viewUpdate: ViewUpdate) {
		if (viewUpdate.docChanged || viewUpdate.viewportChanged || viewUpdate.selectionSet) {
			this.decorations = this.buildDecorations(viewUpdate.view);
		}
	}

	destroy() {}

	buildDecorations(editorView: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (const { from, to } of editorView.visibleRanges) {
			syntaxTree(editorView.state).iterate({
				from,
				to,
				enter(node) {
					if (!node.type.name.startsWith("list")) {
						return;
					}
					const listItemText = editorView.state.doc.slice(node.from, node.to).toString();

					const taskState = Object.values(taskStates).find(({ name }) =>
						listItemText.trimStart().startsWith(getTaskStateDirective(name))
					);

					if (taskState === undefined) {
						return;
					}

					const directive = getTaskStateDirective(taskState.name);

					const selection = editorView.state.selection.main;

					const directiveFrom = node.from;
					const directiveTo = node.from + listItemText.indexOf(directive) + directive.length;

					const isBetween = (point: number, from: number, to: number) =>
						point >= from && point <= to;

					const isPartiallySelected =
						isBetween(selection.from, directiveFrom, directiveTo) ||
						isBetween(selection.to, directiveFrom, directiveTo) ||
						(selection.from <= directiveFrom && selection.to >= directiveTo);

					if (!isPartiallySelected) {
						builder.add(
							directiveFrom,
							directiveTo,
							Decoration.replace({
								widget: new TaskStateWidget({
									directiveRange: { from: { ch: 1, line: 1 }, to: { ch: 2, line: 1 } }, // TODO
									taskStateName: taskState.name,
								}),
							})
						);
					}
				},
			});
		}

		return builder.finish();
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
const pluginSpec = {
	decorations: (value: TaskStateViewValue) => value.decorations,
};

export const taskStateViewPlugin = ViewPlugin.fromClass(TaskStateViewValue, pluginSpec);
