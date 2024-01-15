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
		if (viewUpdate.docChanged || viewUpdate.viewportChanged) {
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

					for (const { name } of Object.values(taskStates)) {
						const taskStateDirective = getTaskStateDirective(name);
						if (!listItemText.startsWith(taskStateDirective)) {
							continue;
						}

						console.log("Text:", listItemText);

						builder.add(
							node.from,
							node.from + taskStateDirective.length,
							Decoration.replace({
								widget: new TaskStateWidget({
									directiveRange: { from: { ch: 1, line: 1 }, to: { ch: 2, line: 1 } },
									taskStateName: name,
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
