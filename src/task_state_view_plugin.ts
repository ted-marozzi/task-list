import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	type PluginValue,
	ViewPlugin,
	ViewUpdate,
	type PluginSpec,
} from "@codemirror/view";
import { TaskStateWidget } from "./task_state_widget";
import { type LogLevel, logWithNamespace } from "./log";
import { getTaskStateDirective } from "./task_state";
import { getTaskStateFromText, isValidList } from "./base";

class TaskStateViewValue implements PluginValue {
	name = "TaskStateViewValue";
	decorations: DecorationSet;

	constructor(editorView: EditorView) {
		this.decorations = this.buildDecorations(editorView);
	}

	async update(viewUpdate: ViewUpdate) {
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
					if (!isValidList(node)) {
						return;
					}
					const listItemText = editorView.state.doc.slice(node.from, node.to).toString();
					const taskState = getTaskStateFromText(listItemText);
					if (taskState === undefined) {
						return;
					}

					const directive = getTaskStateDirective(taskState.name);

					const selection = editorView.state.selection.main;

					const indexOfDirective = listItemText.indexOf(directive);

					const directiveRange = {
						from: node.from + indexOfDirective,
						to: node.from + indexOfDirective + directive.length,
					};

					const isBetween = (point: number, from: number, to: number) =>
						point >= from && point <= to;

					const isPartiallySelected =
						isBetween(selection.from, directiveRange.from, directiveRange.to) ||
						isBetween(selection.to, directiveRange.from, directiveRange.to) ||
						(selection.from <= directiveRange.from && selection.to >= directiveRange.to);

					if (!isPartiallySelected) {
						builder.add(
							directiveRange.from,
							directiveRange.to,
							Decoration.replace({
								widget: new TaskStateWidget({
									directiveRange,
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
const pluginSpec: PluginSpec<TaskStateViewValue> = {
	decorations: (value: TaskStateViewValue) => value.decorations,
};

export const taskStateViewPlugin = ViewPlugin.fromClass(TaskStateViewValue, pluginSpec);
